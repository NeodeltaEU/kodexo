import { createTerminus, TerminusOptions } from '@godaddy/terminus'
import { RouteMethods } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { HttpError } from '@kodexo/errors'
import { Inject } from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'
import { OpenApiService } from '@kodexo/openapi'
import { App as TinyApp, Handler } from '@tinyhttp/app'
import { AccessControlOptions, cors } from '@tinyhttp/cors'
import { json, urlencoded } from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { createServer, Server as HttpServer } from 'http'
import { Class } from 'type-fest'
import { RoutesService } from './components'
import { AppProvidersService } from './components/AppProvidersService'
import { ServerHooks } from './interfaces'

/**
 *
 */
export class App {
  @Inject private configurationService: ConfigurationService
  @Inject private logger: LoggerService
  @Inject private routesService: RoutesService
  @Inject private openApiService: OpenApiService
  @Inject private appProvidersService: AppProvidersService

  public readonly rawApp = new TinyApp({
    onError: (err, req, res) => {
      if (err.code === 404) err = HttpError.NotFound()

      const statusCode = err.statusCode || 500

      const debugServer = this.configurationService.get('debug.displayErrorsOnServerCli') ?? true
      const debugClient =
        this.configurationService.get('debug.displayErrorsOnClientResponse') ?? true
      const skipClientError = this.configurationService.get('debug.skipClientRequestError') ?? false

      if (debugServer && ((!skipClientError && statusCode < 500) || statusCode >= 500)) {
        if (statusCode === 404) {
          delete err.stack
        }

        err.route = req.url
        err.method = req.method?.toUpperCase() ?? 'UNKNOWN'

        this.logger.error(err)
      }

      if (statusCode === 500) err = HttpError.InternalServerError()

      const { message } = err

      const stack = debugClient ? err.stack : undefined
      const errorCode = err.errorCode ? 'E' + err.errorCode.toString().padStart(5, '0') : undefined
      const details = err.details || undefined

      res.status(statusCode).json({
        statusCode,
        errorCode,
        message,
        details,
        stack
      })
    }
  })

  /**
   *
   */
  constructor() {
    this.buildMandatoryMiddlewares()
      .buildBeforeCustomMiddleware()
      .buildRoutesController()
      .buildCustomHandlers()
      .buildFinalMiddlewares()
      .buildMiscRoutes()
      .buildOpenapiSchemaRoute()
  }

  /**
   *
   * @returns
   */
  private buildOpenapiSchemaRoute() {
    const yaml = this.openApiService.processToYaml(this.routesService.getDetailsRoutes())

    this.addRoute('/api-doc', 'GET', (req, res) => {
      res.setHeader('Content-Type', 'text/yaml')
      res.send(yaml)
    })

    return this
  }

  /**
   *
   */
  private buildMandatoryMiddlewares() {
    if (this.configurationService.get('logs.request'))
      this.rawApp.use(this.logger.getLoggerMiddleware())

    const corsOptions: AccessControlOptions = {
      allowedHeaders: ['content-type', 'x-query-schema', 'authorization'],
      exposedHeaders: ['content-length', 'content-type', 'x-total-count', 'set-cookie'],
      credentials: true
    }

    const cookieSecret = this.configurationService.get('cookies.secret')

    if (cookieSecret) {
      this.rawApp.use(cookieParser(cookieSecret) as any)
    }

    this.rawApp
      .use(cors(corsOptions))
      .use(json())
      .use(urlencoded({ extended: true }))

    return this
  }

  /**
   *
   */
  private buildBeforeCustomMiddleware() {
    const middlewares: Handler[] = this.configurationService.get('middlewares') || []

    middlewares.forEach(middleware => {
      this.rawApp.use(middleware)
    })

    return this
  }

  /**
   *
   * @param path
   * @param method
   * @param handler
   */
  public addRoute(path: string, method: string, handler: Handler) {
    switch (method) {
      case 'GET':
        this.rawApp.get(path, handler)
        break
      case 'POST':
        this.rawApp.post(path, handler)
        break
      case 'DELETE':
        this.rawApp.delete(path, handler)
        break
      case 'PUT':
        this.rawApp.put(path, handler)
        break
      case 'PATCH':
        this.rawApp.patch(path, handler)
        break
    }
  }

  /**
   *
   */
  private buildFinalMiddlewares() {
    return this
  }

  /**
   *
   */
  private buildMiscRoutes() {
    // Avoiding 404 error on favicon when browsers hit the API
    this.rawApp.get('/favicon.ico', (req, res) => res.status(204).end())
    return this
  }

  /**
   *
   * @returns
   */
  private buildCustomHandlers() {
    Array.from(this.routesService.customHandlers.entries()).forEach(([path, handler]) => {
      this.rawApp.use(path, handler)
    })

    return this
  }

  /**
   *
   */
  private buildRoutesController() {
    const paths = this.routesService.getDetailsRoutes()

    Array.from(paths.entries()).forEach(([path, routeEndpoints]) => {
      routeEndpoints.forEach(({ endpoint, middlewares, handler }) => {
        switch (endpoint.method) {
          case RouteMethods.GET:
            this.rawApp.get(path, ...middlewares, handler)
            break

          case RouteMethods.POST:
            this.rawApp.post(path, ...middlewares, handler)
            break

          case RouteMethods.PUT:
            this.rawApp.put(path, ...middlewares, handler)
            break

          case RouteMethods.PATCH:
            this.rawApp.patch(path, ...middlewares, handler)
            break

          case RouteMethods.DELETE:
            this.rawApp.delete(path, ...middlewares, handler)
            break
        }
      })
    })

    const count = this.routesService.routesCount

    this.logger.info(`[APP] ${count} routes registered`)

    return this
  }

  /**
   *
   */
  private prepareReadinessLiveness(server: HttpServer) {
    const readinessLivenessOptions: TerminusOptions = {
      healthChecks: {
        '/healthcheck': async () => {
          return 'ok'
        },
        verbatim: true
      },

      signals: ['SIGINT', 'SIGTERM'],

      onShutdown: async () => {
        this.logger.info('[APP] Shutting down...')
      },

      onSignal: async () => {
        this.logger.info(`[APP] Close signal received...`)
        await this.appProvidersService.executeClose()
      }
    }

    return createTerminus(server, readinessLivenessOptions)
  }

  /**
   *
   * @param port
   */
  public listenForRequests(): HttpServer {
    const port = this.configurationService.get('port') || 3000

    const server = createServer().on('request', this.rawApp.attach)

    return this.prepareReadinessLiveness(server).listen(port, () => {
      this.logger.info(`[APP] SERVER STARTED ON ${port}`)
    })
  }

  /**
   * @param tokenServer
   */
  static async bootstrap(Server: Class<ServerHooks>): Promise<HttpServer> {
    await AppProvidersService.startServer(Server)

    const app = new App()
    return app.listenForRequests()
  }
}
