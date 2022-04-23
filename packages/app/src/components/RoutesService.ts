import { AsyncHandler, Handler } from '@tinyhttp/app'
import {
  ControllerProvider,
  Endpoint,
  MiddlewareHandler,
  NextFunction,
  Request,
  Response,
  Service
} from '@kodexo/common'
import { IProvider, providerRegistry } from '@kodexo/injection'
import { parse } from 'regexparam'

export type RouteEndpoint = {
  endpoint: Endpoint
  handler: Handler
  middlewares: Array<Handler>
}

export type RequestWithResult = Request & {
  result?: any
}

@Service()
export class RoutesService {
  private currentRouting: IProvider[] = []
  private routes: Map<string, RouteEndpoint[]> = new Map()
  private registeredCount = 0

  /**
   *
   * @param routing
   * @returns
   */
  private buildRoutes() {
    providerRegistry.controllers.forEach((controllerProvider: ControllerProvider) => {
      this.currentRouting
        .filter(provider => provider.token === controllerProvider.token)
        .map(provider => provider.route)
        .forEach(mountEndpoint =>
          controllerProvider.endpoints.forEach(endpoint => {
            /**
             *
             * @param req
             * @param res
             */
            const resultHandler = (req: RequestWithResult, res: Response) => {
              const { statusCode, headers } = endpoint

              res.set(headers)
              res.status(statusCode)
              res.json(req.result)
            }

            /**
             *
             */
            const middlewares = this.transformMiddlewareIntancesIntoHandlers(
              ...controllerProvider.middlewares,
              ...endpoint.middlewares
            )

            /**
             *
             * @param req
             * @param res
             */
            const executeCallbackMiddleware = async (
              req: RequestWithResult,
              res: Response,
              next: NextFunction
            ) => {
              req.result = await endpoint.handler.bind(controllerProvider.instance)(req, res)
              next()
            }

            //
            middlewares.push(executeCallbackMiddleware)

            /**
             *
             */
            const interceptors = this.transformMiddlewareIntancesIntoHandlers(
              ...endpoint.interceptors
            )

            //
            middlewares.push(...interceptors)

            const routeEndpoint = {
              endpoint,
              middlewares,
              handler: resultHandler
            }

            // TODO: PROTECT PATH & NORMALIZE THEM
            const path = `${mountEndpoint}${controllerProvider.path}${endpoint.path}`
              .replace(/\/+/g, '/')
              .replace(/\/+$/, '')

            if (this.routes.has(path)) {
              this.routes.get(path)?.push(routeEndpoint)
            } else {
              this.routes.set(path, [routeEndpoint])
            }

            this.registeredCount++
          })
        )
    })
  }

  /**
   *
   * @param route
   */
  public getEndpointFromRoute(route: string) {
    if (!this.routes.has(route)) throw new Error(`Route not found: ${route}`)
    return this.routes.get(route)
  }

  /**
   *
   */
  public get routesWithMethods(): Map<string, string> {
    const routes = new Map()

    Array.from(this.routes.entries()).forEach(([path, routeEndpoints]) => {
      routes.set(
        path,
        routeEndpoints.map(routeEndpoint => routeEndpoint.endpoint.method)
      )
    })

    return routes
  }

  public get routesCount() {
    return this.registeredCount
  }

  /**
   *
   */
  public getDetailsRoutes() {
    return this.routes
  }

  /**
   *
   * @param path
   */
  public getDetailsRouteFromPath(path: string, method: string) {
    const foundPath = Array.from(this.routes.keys())
      .map(route => ({ route, ...parse(route) }))
      .find(regex => regex.pattern.test(path))

    if (!foundPath) throw new Error(`Route not found: ${path}`)

    const routeEndpoints = this.routes.get(foundPath.route)

    return routeEndpoints?.find(
      routeEndpoint => routeEndpoint.endpoint.method === method.toLowerCase()
    )
  }

  /**
   *
   * @param routing
   */
  public updateRouting(routing: IProvider[]) {
    this.currentRouting = routing

    // Reset
    this.routes = new Map()
    this.registeredCount = 0

    this.buildRoutes()
    return this
  }

  /**
   *
   */
  private transformMiddlewareIntancesIntoHandlers(
    ...middlewaresInstances: MiddlewareHandler[]
  ): Handler[] {
    const { mergedMiddlewares } = providerRegistry

    return middlewaresInstances.map(middlewareInstance => {
      const { instance, middlewareToken, handler, args } = middlewareInstance

      return (req: Request, res: Response, next: NextFunction) => {
        if (instance) {
          const handler = instance.use
          return handler.bind(instance)(req, res, next, args).catch(next)
        }

        if (middlewareToken) {
          const middlewareFound = mergedMiddlewares.get(middlewareToken)

          if (!middlewareFound) throw new Error(`Middleware not found: ${middlewareToken}`)

          const handler = middlewareFound.instance.use
          return handler.bind(middlewareFound.instance)(req, res, next, args).catch(next)
        }

        if (!handler) throw new Error(`Middleware not found`)

        try {
          // TODO: No args here ?
          return handler(req, res, next)
        } catch (err) {
          next(err)
        }
      }
    })
  }
}
