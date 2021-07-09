import { Store } from '@neatsio/injection'
import { Class } from 'type-fest'
import { RouteMethods } from '../methods'

/**
 *
 */
export class Endpoint {
  public path: string

  public method: RouteMethods

  public statusCode: number = 200

  public descriptor: any

  public store: Store

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
    externalDecorating
  }: EndpointOptions) {
    this.store = Store.from(target, propertyKey, descriptor)

    this.externalDecorating = !!externalDecorating

    this.descriptor = descriptor.value
    this.method = method
    this.path = path
    this.target = target
    this.propertyKey = propertyKey

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
   */
  get handler() {
    const { descriptor, externalDecorating, target, propertyKey } = this

    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || []

    return function (this: any, req: any, res: any) {
      if (externalDecorating) return descriptor.apply(this, [req, res])

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
  statusCode?: number
}
