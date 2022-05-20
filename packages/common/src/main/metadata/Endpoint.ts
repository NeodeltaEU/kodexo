import { Store } from '@kodexo/injection'
import { Handler } from '@tinyhttp/app'
import { Class } from 'type-fest'
import { getClass } from '../..'
import { MiddlewareHandling } from '../../interfaces'
import { RouteMethods } from '../methods'
import kebabCase = require('lodash.kebabcase')

export enum MethodsParams {
  BODY_PARAMS = 'BodyParams',
  ROUTE_PARAMS = 'RouteParams',
  COOKIE_PARAMS = 'CookieParams',
  REQ = 'Req',
  RES = 'Res'
}

/**
 *
 */
export class Endpoint {
  public path: string

  public method: RouteMethods

  public statusCode: number = 200

  public headers: Record<string, string> = {}

  public descriptor: any
  private rawDescriptor: any

  public middlewares: MiddlewareHandler[] = []

  public interceptors: MiddlewareHandler[] = []

  public propertyKey: string

  public externalDecorating: boolean = false

  public readonly target: any

  public readonly action: string

  constructor({
    target,
    propertyKey,
    descriptor,
    method,
    path,
    statusCode,
    externalDecorating,
    headers,
    middlewares,
    interceptors,
    action
  }: EndpointOptions) {
    this.externalDecorating = !!externalDecorating

    this.rawDescriptor = descriptor
    this.descriptor = descriptor.value
    this.method = method
    this.path = path
    this.target = target
    this.propertyKey = propertyKey
    this.action = action

    if (middlewares?.length) this.middlewares = middlewares
    if (interceptors?.length) this.interceptors = interceptors
    if (headers && Object.keys(headers).length) this.headers = headers

    this.prepareStatusCode(statusCode)
  }

  /**
   *
   */
  get store() {
    return Store.from(this.target, this.propertyKey, this.rawDescriptor)
  }

  /**
   *
   */
  get paramsStores() {
    const paramTypes: any[] =
      Reflect.getMetadata('design:paramtypes', this.target, this.propertyKey) || []

    return paramTypes.map((type: any, index: number) => {
      return Store.from(this.target, this.propertyKey, index)
    })
  }

  /**
   *
   */
  prepareStatusCode(statusCode = 200) {
    if (this.externalDecorating) {
      this.statusCode = statusCode
      return
    }

    this.statusCode = this.store.has('statusCode') ? this.store.get('statusCode') : statusCode
  }

  /**
   *
   * @param middlewareToken
   * @param args
   * @param top
   */
  addMiddleware(middlewareToken: Class<MiddlewareHandling>, args: any, top = false) {
    const toPush = {
      middlewareToken,
      args
    }

    top ? this.middlewares.unshift(toPush) : this.middlewares.push(toPush)
  }

  /**
   *
   */
  addInstanciedMiddleware(instance: MiddlewareHandling, args: any, top = false) {
    const toPush = {
      instance,
      args
    }

    top ? this.middlewares.unshift(toPush) : this.middlewares.push(toPush)
  }

  /**
   *
   */
  addRawMiddleware(handler: Handler, top = false) {
    const toPush = {
      handler
    }

    top ? this.middlewares.unshift(toPush) : this.middlewares.push(toPush)
  }

  /**
   *
   * @param middlewareToken
   * @param args
   * @param top
   */
  addInterceptor(middlewareToken: Class<MiddlewareHandling>, args: any, top = false) {
    const toPush = {
      middlewareToken,
      args
    }

    top ? this.interceptors.unshift(toPush) : this.interceptors.push(toPush)
  }

  /**
   *
   */
  addInstanciedInterceptor(instance: MiddlewareHandling, args: any, top = false) {
    const toPush = {
      instance,
      args
    }

    top ? this.interceptors.unshift(toPush) : this.interceptors.push(toPush)
  }

  /**
   *
   */
  addRawInterceptor(handler: Handler, top = false) {
    const toPush = {
      handler
    }

    top ? this.interceptors.unshift(toPush) : this.interceptors.push(toPush)
  }

  /**
   *
   */
  setHeader(key: string, value: any) {
    this.headers[key] = value
  }

  /**
   *
   */
  get controllerResource(): string {
    const kebab = kebabCase(getClass(this.target).name)

    // removing "-controller" from the end of the string
    return kebab.substring(0, kebab.length - 11)
  }

  /**
   *
   */
  get handler() {
    const { descriptor, externalDecorating, target, propertyKey } = this

    const currentEndpoint = this

    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) || []

    return function (this: any, req: any, res: any) {
      if (externalDecorating) return descriptor.apply(this, [req, res, currentEndpoint])

      const params = paramTypes.map((entry: any, index) => {
        const store = Store.from(target, propertyKey, index)

        const type = store.get('type')
        const paramName = store.get('paramName')
        const callback = store.get('callback')

        // TODO: create a class to handle this & dispatch domain outside decorator & others things
        // TODO: test & send errors when paramName doesnt exist

        let toPush

        switch (type) {
          case MethodsParams.ROUTE_PARAMS:
            toPush = paramName ? req.params[paramName] : req.params
            break

          /*case MethodsParams.BODY_PARAMS:
            toPush = paramName ? req.body[paramName] : req.body
            break*/

          case MethodsParams.COOKIE_PARAMS:
            toPush = paramName ? req.signedCookies[paramName] : req.signedCookies
            break

          case MethodsParams.REQ:
            toPush = req
            break

          case MethodsParams.RES:
            toPush = res
            break

          default:
            toPush = callback(paramName, req, res)
            break
        }

        return toPush
      })

      return descriptor.apply(this, params)
    }
  }
}

export type EndpointOptions = {
  target: Class
  propertyKey: string
  externalDecorating?: boolean
  descriptor: any
  method: RouteMethods
  path: string
  middlewares?: MiddlewareHandler[]
  interceptors?: MiddlewareHandler[]
  headers?: Record<string, string>
  statusCode?: number
  action: string
}

export type MiddlewareHandler = {
  handler?: Handler
  instance?: MiddlewareHandling
  middlewareToken?: Class<MiddlewareHandling>
  args?: any
}
