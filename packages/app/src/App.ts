import { App as TinyApp, Handler, Request, Response } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { logger } from '@tinyhttp/logger'
import { ControllerProvider, RouteMethods } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { HttpError } from '@uminily/errors'
import { Inject, providerRegistry, Store } from '@uminily/injection'
import { json, urlencoded } from 'body-parser'
import { Server } from 'http'
import { Class } from 'type-fest'
import { ServerHooks } from './interfaces'
import { importFiles } from './utils/importFiles'

/**
 *
 */
export class App {
  @Inject configurationService: ConfigurationService

  public readonly rawApp = new TinyApp({
    onError: (err, req, res) => {
      if (err.code === 404) err = HttpError.NotFound()

      const statusCode = err.statusCode || 500

      const debugServer = this.configurationService.get('debugServer') ?? true
      const debugClient = this.configurationService.get('debugClient') ?? true
      const skipClientError = this.configurationService.get('skipClientError') ?? false

      if (debugServer && ((!skipClientError && statusCode < 500) || statusCode >= 500))
        console.error(err)

      if (statusCode === 500) err = HttpError.InternalServerError()

      const { message, defaultHttpClassError } = err

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
      .buildFinalMiddlewares()
      .buildMiscRoutes()
  }

  /**
   *
   */
  private buildMandatoryMiddlewares() {
    if (this.configurationService.get('logRoutes')) this.rawApp.use(logger())

    this.rawApp
      .use(cors())
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
    providerRegistry.controllers.forEach((controllerProvider: ControllerProvider) => {
      controllerProvider.endpoints.forEach(endpoint => {
        const handler = async (req: Request, res: Response) => {
          const result = await endpoint.handler.bind(controllerProvider.instance)(req, res)
          res.status(endpoint.statusCode).json(result)
        }

        const path = controllerProvider.path.toString() + endpoint.path

        switch (endpoint.method) {
          case RouteMethods.GET:
            this.rawApp.get(path, handler)
            break

          case RouteMethods.POST:
            this.rawApp.post(path, handler)
            break

          case RouteMethods.PATCH:
            this.rawApp.patch(path, handler)
            break

          case RouteMethods.DELETE:
            this.rawApp.delete(path, handler)
            break
        }
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
    return this.rawApp.listen(port)
  }

  /**
   *
   * @param tokenServer
   */
  static async bootstrap(tokenServer: Class<ServerHooks>): Promise<Server> {
    const config = Store.from(tokenServer).get('configuration') as Kodexo.Configuration

    const server = new tokenServer()

    providerRegistry
      .resolve<ConfigurationService>(ConfigurationService)
      .instance.applyConfig(config)

    await importFiles('**/*.controller.ts')

    let initPromises: any = []

    providerRegistry.services.forEach(value => {
      initPromises.push(value.init())
    })

    await Promise.all(initPromises)

    if (server.afterInit) await server.afterInit()

    const app = new App()
    return app.listenForRequests()
  }
}
