import { App as TinyApp, Handler, NextFunction, Request, Response } from '@tinyhttp/app'
import { AccessControlOptions, cors } from '@tinyhttp/cors'
import { ControllerProvider, ModuleProvider, pMap, RouteMethods } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { LoggerService } from '@uminily/logger'
import { HttpError } from '@uminily/errors'
import {
  Inject,
  Injector,
  importProviders,
  providerRegistry,
  Store,
  IProvider,
  Registries,
  ConstructorParam,
  ProviderType
} from '@uminily/injection'
import { json, urlencoded } from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { Server as HttpServer } from 'http'
import { Class } from 'type-fest'
import { ServerHooks } from './interfaces'
import { QueueManager } from '@uminily/queueing'
import { createTerminus, TerminusOptions } from '@godaddy/terminus'

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
          const middlewares: Handler[] = [
            ...controllerProvider.middlewares,
            ...endpoint.middlewares
          ].map(middleware => {
            return (req: Request, res: Response, next: NextFunction) => {
              if (middleware.instance) {
                const handler = middleware.instance.use
                try {
                  return handler.bind(middleware.instance)(req, res, next)
                } catch (err) {
                  return next(err)
                }
              }

              if (middleware.middlewareToken) {
                const middlewareFound = middlewareProviders.get(middleware.middlewareToken)

                if (!middlewareFound)
                  throw new Error(`Middleware not found: ${middleware.middlewareToken}`)

                const handler = middlewareFound.instance.use
                try {
                  return handler.bind(middlewareFound.instance)(req, res, next)
                } catch (err) {
                  return next(err)
                }
              }

              if (!middleware.handler) throw new Error(`Middleware not found`)

              try {
                return middleware.handler(req, res, next)
              } catch (err) {
                return next(err)
              }
            }
          })

          /*const controllerMiddlewares: Handler[] = controllerProvider.middlewares.map(
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

          const middlewares = [...controllerMiddlewares, ...endpointMiddlewares]*/

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
   */
  private prepareReadinessLiveness(server: HttpServer) {
    const readinessLivenessOptions: TerminusOptions = {
      healthChecks: {
        '/healthcheck': async () => {
          return 'ok'
        }
      },

      onShutdown: async () => {
        this.logger.info('[APP] Shutting down...')
      },

      onSignal: async () => {
        this.logger.info(`[APP] Close signal received...`)
        // Close database or prepare some executions from server instance
      }
    }

    createTerminus(server, readinessLivenessOptions)
  }

  /**
   *
   * @param port
   */
  public listenForRequests(): HttpServer {
    const port = this.configurationService.get('port') || 3000

    const server = this.rawApp.listen(port, () => {
      this.logger.info(`[APP] SERVER STARTED ON ${port}`)
    })

    this.prepareReadinessLiveness(server)

    return server
  }

  /**
   * TODO: REFACTOR ALL OF THIS OMG OMG
   * @param tokenServer
   */
  static async bootstrap(Server: Class<ServerHooks>): Promise<HttpServer> {
    const logger = await Injector.invoke(LoggerService)

    logger.separator()

    const serverStore = Store.from(Server)

    const config = serverStore.get('configuration') as Kodexo.Configuration

    const configuration = await Injector.invoke(ConfigurationService)
    configuration.applyConfig(config)

    logger.separator()

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
  }
}
