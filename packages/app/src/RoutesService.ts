import { Handler } from '@tinyhttp/app'
import {
  ControllerProvider,
  Request,
  Response,
  NextFunction,
  Service,
  Endpoint
} from '@uminily/common'
import { IProvider, providerRegistry } from '@uminily/injection'
import { parse } from 'regexparam'

export type RouteEndpoint = {
  endpoint: Endpoint
  handler: Handler
  middlewares: Array<Handler>
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
    const { middlewares, controllers } = providerRegistry

    controllers.forEach((controllerProvider: ControllerProvider) => {
      const mountingEndpoints = this.currentRouting
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
          const preparedMiddlewares: Handler[] = [
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
                const middlewareFound = middlewares.get(middleware.middlewareToken)

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

          const routeEndpoint = {
            endpoint,
            handler,
            middlewares: preparedMiddlewares
          }

          if (this.routes.has(path)) {
            this.routes.get(path)?.push(routeEndpoint)
          } else {
            this.routes.set(path, [routeEndpoint])
          }

          this.registeredCount++
        })
      })
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

    return routeEndpoints?.find(routeEndpoint => routeEndpoint.endpoint.method === method)
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
}
