import { createTerminus, TerminusOptions } from '@godaddy/terminus'
import { ModuleProvider, pMap, RouteMethods } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { HttpError } from '@kodexo/errors'
import {
  ConstructorParam,
  importProviders,
  Inject,
  Injector,
  IProvider,
  providerRegistry,
  ProviderType,
  Registries
} from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'
import { OpenApiService } from '@kodexo/openapi'
import { QueueManager } from '@kodexo/queueing'
import { App as TinyApp, Handler } from '@tinyhttp/app'
import { AccessControlOptions, cors } from '@tinyhttp/cors'
import { json, urlencoded } from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { createServer, Server as HttpServer } from 'http'
import * as PrettyError from 'pretty-error'
import { Class } from 'type-fest'
import { RoutesService } from './components'
import { AppProvidersService } from './components/AppProvidersService'
import { ServerHooks } from './interfaces'

/**
 *
 */
export class App {
  @Inject configurationService: ConfigurationService
  @Inject logger: LoggerService
  @Inject routesService: RoutesService
  @Inject openApiService: OpenApiService
  @Inject appProvidersService: AppProvidersService

  public readonly rawApp = new TinyApp({
    onError: (err, req, res) => {
      if (err.code === 404) err = HttpError.NotFound()

      const statusCode = err.statusCode || 500

      const debugServer = this.configurationService.get('debug.displayErrorsOnServerCli') ?? true
      const debugClient =
        this.configurationService.get('debug.displayErrorsOnClientResponse') ?? true
      const skipClientError = this.configurationService.get('debug.skipClientRequestError') ?? false

      if (debugServer && ((!skipClientError && statusCode < 500) || statusCode >= 500))
        this.logger.error(err)

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
  constructor(public routing: IProvider[] = []) {
    this.buildMandatoryMiddlewares()
      .buildBeforeCustomMiddleware()
      .buildRoutesController()
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
   */
  private buildRoutesController() {
    const paths = this.routesService.updateRouting(this.routing).getDetailsRoutes()

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
   * TODO: REFACTOR ALL OF THIS OMG OMG
   * @param tokenServer
   */
  static async bootstrap(Server: Class<ServerHooks>): Promise<HttpServer> {
    const pe = new PrettyError()

    try {
      const { logger, configuration, serverStore } = await AppProvidersService.startInvokation(
        Server
      )

      const appModule = configuration.getOrFail('appModule')

      // TODO: Move all of that into domain to register module & start rootModule
      const RootModule = class {}

      const moduleProvider = new ModuleProvider(RootModule, [
        appModule,
        LoggerService,
        RoutesService,
        OpenApiService
      ])

      providerRegistry.registerProvider(Registries.MODULE, moduleProvider)

      const providers = await importProviders([RootModule])

      const routing = providers.filter(provider => provider.route)

      await Injector.invoke(RootModule)

      await pMap(routing, async provider => {
        await Injector.invoke(provider.token)
      })

      // TODO: Something is weird about loading module declarated providers only
      // when a @Decorator is found, the provider is created and added to registry, it must be loaded only if
      // it's declarated into a module

      const providersLoaded = providerRegistry.providerStates.filter(
        provider => provider.status === 'loaded'
      ).length

      const providersFound = providerRegistry.providerStates.length
      const controllersFound = routing.length
      const queuesFound = providerRegistry.providerStates.filter(
        provider => provider.status === 'loaded' && provider.type === ProviderType.QUEUE
      ).length

      logger.separator()
      for (const provider of providerRegistry.providerStates) {
        logger.info(`[INJECTION] Status: ${provider.status} \t ${provider.name}`)
      }
      logger.separator()
      logger.info(`[INJECTION] ${providersLoaded} loaded / ${providersFound} provider(s) found`)
      logger.info(`[INJECTION] ${controllersFound} controller(s) found`)
      logger.info(`[INJECTION] ${queuesFound} queue(s) found`)
      logger.separator()

      const serverConstructorsParams = serverStore.has('constructorParams')
        ? serverStore.get('constructorParams')
        : []

      serverConstructorsParams.sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)

      const server = new Server(
        ...serverConstructorsParams.map((param: ConstructorParam) => param.provider.instance)
      )

      if (queuesFound) {
        const queueManager = providerRegistry.getInstanceOf(QueueManager)
        queueManager.prepareQueues()
      }

      if (server.afterInit) await server.afterInit()

      const app = new App(routing)
      return app.listenForRequests()
    } catch (err: any) {
      const rendered = pe.render(err)
      console.error(rendered)

      process.exit(0)
    }
  }
}
