import { Handler } from '@tinyhttp/app'
import { Store } from '@uminily/injection'
import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'
import { Dictionnary } from '../../interfaces/Dictionnary'
import { RouteMethods } from '../methods'

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

  private target: any

  constructor({
    target,
    propertyKey,
    descriptor,
    method,
    path,
    statusCode,
    externalDecorating,
    headers,
    middlewares
  }: EndpointOptions) {
    this.store = Store.from(target, propertyKey, descriptor)

    this.externalDecorating = !!externalDecorating

    this.descriptor = descriptor.value
    this.method = method
    this.path = path
    this.target = target
    this.propertyKey = propertyKey

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
  addMiddleware(handler: Handler, instance?: MiddlewareHandling, top = false) {
    const toPush = {
      handler,
      instance
    }

    if (top) {
      this.middlewares.unshift(toPush)
      return
    }

    this.middlewares.push(toPush)
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
  get handler() {
    const { descriptor, externalDecorating, target, propertyKey } = this

    const currentEndpoint = this

    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || []

    return function (this: any, req: any, res: any) {
      if (externalDecorating) return descriptor.apply(this, [req, res, currentEndpoint])

      const params = new Array(paramTypes.length).fill(null).map((entry, index) => {
        const store = Store.from(target, propertyKey, index)

        const type = store.get('type')
        const paramName = store.get('paramName')

        // TODO : create a class to handle this & dispatch domain outside decorator & others things

        switch (type) {
          case 'RouteParams':
            return paramName ? req.params[paramName] : req.params

          case 'BodyParams':
            return paramName ? req.body[paramName] : req.body
        }

        return entry
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
}

export type MiddlewareHandler = {
  handler: Handler
  instance?: MiddlewareHandling
}
