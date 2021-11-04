import { Handler } from '@tinyhttp/app'
import { Store } from '@uminily/injection'
import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'
import { Dictionnary } from '../../interfaces/Dictionnary'
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

  public headers: Dictionnary = {}

  public descriptor: any

  public store: Store

  public middlewares: MiddlewareHandler[] = []

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
    action
  }: EndpointOptions) {
    this.store = Store.from(target, propertyKey, descriptor)

    this.externalDecorating = !!externalDecorating

    this.descriptor = descriptor.value
    this.method = method
    this.path = path
    this.target = target
    this.propertyKey = propertyKey
    this.action = action

    if (middlewares?.length) this.middlewares = middlewares
    if (headers && Object.keys(headers).length) this.headers = headers

    this.prepareStatusCode(statusCode)
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
   * @param middlewares
   */
  /*addMiddleware(handler: Handler, instance?: MiddlewareHandling, top = false) {
    const toPush = {
      handler,
      instance
    }

    if (top) {
      this.middlewares.unshift(toPush)
      return
    }

    this.middlewares.push(toPush)
  }*/

  addMiddleware(middlewareToken: Class<MiddlewareHandling>, top = false) {
    const toPush = {
      middlewareToken
    }

    top ? this.middlewares.unshift(toPush) : this.middlewares.push(toPush)
  }

  /**
   *
   */
  addInstanciedMiddleware(instance: MiddlewareHandling, top = false) {
    const toPush = {
      instance
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
   */
  setHeader(key: string, value: any) {
    this.headers[key] = value
  }

  /**
   *
   */
  get controllerResource(): string {
    const kebab = kebabCase(this.target.constructor.name)

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
  headers?: Dictionnary
  statusCode?: number
  action: string
}

export type MiddlewareHandler = {
  handler?: Handler
  instance?: MiddlewareHandling
  middlewareToken?: Class<MiddlewareHandling>
}
