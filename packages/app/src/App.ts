import { App as TinyApp, Handler, NextFunction, Request, Response } from '@tinyhttp/app'
import { AccessControlOptions, cors } from '@tinyhttp/cors'
import { ControllerProvider, ModuleProvider, pMap, RouteMethods } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { LoggerService } from '@uminily/logger'
import { HttpError } from '@uminily/errors'
import {
  Inject,
  importProviders,
  providerRegistry,
  Store,
  IProvider,
  Registries
} from '@uminily/injection'
import { json, urlencoded } from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { Server } from 'http'
import { Class } from 'type-fest'
import { ServerHooks } from './interfaces'
import { Injector } from './Injector'

/**
 *
 */
export class App {
  @Inject configurationService: ConfigurationService
  @Inject logger: LoggerService

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
  }

  /**
   *
   */
  private buildMandatoryMiddlewares() {
    if (this.configurationService.get('logs.request'))
      this.rawApp.use(this.logger.getLoggerMiddleware())

    const corsOptions: AccessControlOptions = {
      allowedHeaders: ['content-type', 'x-query-schema', 'authorization'],
      exposedHeaders: ['content-length', 'content-type', 'x-total-count']
    }

    const cookieSecret = this.configurationService.get('cookies.secret')

    if (cookieSecret) {
      this.rawApp.use(cookieParser(cookieSecret) as any)
    }

    this.rawApp
      .use(cors(corsOptions))
      .use(cookieParser(cookieSecret) as any)
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
    const middlewareProviders = providerRegistry.middlewares

    // TODO: EXTERNALIZE ALL THIS !!!
    providerRegistry.controllers.forEach((controllerProvider: ControllerProvider) => {
      const mountingEndpoints = this.routing
        .filter(provider => provider.token === controllerProvider.token)
        .map(provider => provider.route)

      mountingEndpoints.forEach(mountEndpoint => {
        controllerProvider.endpoints.forEach(endpoint => {
          const handler = async (req: Request, res: Response) => {
            //
            const result = await endpoint.handler.bind(controllerProvider.instance)(req, res)

            //
            res.set(endpoint.headers)

            //
            res.status(endpoint.statusCode).json(result)
          }

          // TODO: PROTECT PATH & NORMALIZE THEM
          const path = `${mountEndpoint}${controllerProvider.path}${endpoint.path}`
            .replace(/\/+/g, '/')
            .replace(/\/+$/, '')

          // TODO: REFACTOR OMG
          const endpointMiddlewares: Handler[] = endpoint.middlewares.map(middleware => {
            return (req: Request, res: Response, next: NextFunction) => {
              if (middleware.instance) {
                const handler = middleware.instance.use
                return handler.bind(middleware.instance)(req, res, next)
              }

              if (middleware.middlewareToken) {
                const middlewareFound = middlewareProviders.get(middleware.middlewareToken)

                if (!middlewareFound)
                  throw new Error(`Middleware not found: ${middleware.middlewareToken}`)

                const handler = middlewareFound.instance.use
                return handler.bind(middlewareFound.instance)(req, res, next)
              }

              if (!middleware.handler) throw new Error(`Middleware not found`)

              return middleware.handler(req, res, next)
            }
          })

          const controllerMiddlewares: Handler[] = controllerProvider.middlewares.map(
            middleware => (req: Request, res: Response, next: NextFunction) => {
              if (middleware.middlewareToken) {
                const middlewareFound = middlewareProviders.get(middleware.middlewareToken)

                if (!middlewareFound)
                  throw new Error(`Middleware not found: ${middleware.middlewareToken}`)

                const handler = middlewareFound.instance.use
                return handler.bind(middlewareFound.instance)(req, res, next)
              }

              if (!middleware.handler) throw new Error(`Middleware not found`)

              return middleware.handler(req, res, next)
            }
          )

          const middlewares = [...controllerMiddlewares, ...endpointMiddlewares]

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
    })

    return this
  }

  /**
   *
   * @param port
   */
  public listenForRequests(): Server {
    const port = this.configurationService.get('port') || 3000
    return this.rawApp.listen(port, () => {
      this.logger.info(`SERVER STARTED ON ${port}`)
    })
  }

  /**
   *
   * @param tokenServer
   */
  static async bootstrap(Server: Class<ServerHooks>): Promise<Server> {
    const config = Store.from(Server).get('configuration') as Kodexo.Configuration

    const configuration = await Injector.invoke(ConfigurationService)
    configuration.applyConfig(config)

    const logger = await Injector.invoke(LoggerService)

    const appModule = configuration.getOrFail('appModule')

    // TODO: Move all of that into domain to register module & start rootModule
    const RootModule = class {}

    const moduleProvider = new ModuleProvider(RootModule, [appModule, LoggerService])
    providerRegistry.registerProvider(Registries.MODULE, moduleProvider)

    const providers = await importProviders([RootModule])
    const routing = providers.filter(provider => provider.route)

    await Injector.invoke(RootModule)

    await pMap(routing, async provider => {
      await Injector.invoke(provider.token)
    })

    const providersLoaded = providerRegistry.providerStates.filter(
      provider => provider.status === 'loaded'
    ).length
    const providersFound = providerRegistry.providerStates.length

    logger.info('---------------')
    for (const provider of providerRegistry.providerStates) {
      logger.info(`Status: ${provider.status} \t ${provider.name}`)
    }
    logger.info('---------------')
    logger.info(`${providersLoaded} Loaded / ${providersFound} Providers Found`)
    logger.info('---------------')

    const server = new Server()

    if (server.afterInit) await server.afterInit()

    const app = new App(routing)
    return app.listenForRequests()
  }
}
