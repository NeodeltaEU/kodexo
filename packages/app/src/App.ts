import { Server } from 'http'
import { App as TinyApp, Handler, Request, Response } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { json } from 'body-parser'
import { Inject, providerRegistry, Store } from '@kodexo/injection'
import { ControllerProvider, RouteMethods } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { HttpError } from '@kodexo/errors'

import { importFiles } from './utils/importFiles'
import { Class } from 'type-fest'

/**
 *
 */
export class App {
  @Inject configurationService: ConfigurationService

  public readonly rawApp = new TinyApp({
    onError: (err, req, res) => {
      err = err.defaultHttpClassError || err

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
  constructor(private options = {}) {
    this.buildMandatoryMiddlewares()
      .buildBeforeCustomMiddleware()
      .buildRoutesController()
      .buildFinalMiddlewares()
  }

  /**
   *
   */
  private buildMandatoryMiddlewares() {
    this.rawApp.use(cors()).use(json())
    //.use(json())
    //.use(urlencoded({ extended: true }))

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
  private buildRoutesController() {
    providerRegistry.controllers.forEach((controllerProvider: ControllerProvider) => {
      //const router = new TinyApp()

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

      //this.rawApp.use(controllerProvider.path.toString(), router)
    })

    return this
  }

  /**
   *
   * @param port
   */
  public listen(port = 3000): Server {
    return this.rawApp.listen(port)
  }

  /**
   *
   */
  static async start(options: AppOptions = {}) {
    await importFiles('**/*Controller.ts')

    const app = new App()
    return app.listen(options.port)
  }

  /**
   *
   */
  static async buildSingleRawApp(options: AppOptions = {}) {
    await importFiles('**/*.controller.ts')

    let initPromises: any = []

    providerRegistry.services.forEach(value => {
      initPromises.push(value.init())
    })

    await Promise.all(initPromises)

    const app = new App()
    return app.rawApp.listen(options.port || 3000)
  }

  /**
   *
   * @param tokenServer
   */
  static async bootstrap(tokenServer: Class): Promise<Server> {
    const config = Store.from(tokenServer).get('configuration') as Kodexo.Configuration

    providerRegistry
      .resolve<ConfigurationService>(ConfigurationService)
      .instance.applyConfig(config)

    await importFiles('**/*.controller.ts')

    let initPromises: any = []

    providerRegistry.services.forEach(value => {
      initPromises.push(value.init())
    })

    await Promise.all(initPromises)

    const app = new App()
    return app.rawApp.listen(3000)
  }
}

export type AppOptions = {
  port?: number
}
