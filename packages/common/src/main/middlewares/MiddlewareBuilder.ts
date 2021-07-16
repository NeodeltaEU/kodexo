import { Handler } from '@tinyhttp/app'
import { Class } from 'type-fest'
import { providerRegistry, Store } from '../../../../injection/dist'
import { MiddlewareHandling } from '../../interfaces'
import { getClass } from '../../utils'
import { Endpoint } from '../metadata'

export class MiddlewareBuilder {
  private methodName?: string
  private middlewareToken: Class<MiddlewareHandling>

  constructor(private target: any) {}

  /**
   *
   * @param methodName
   */
  forMethod(methodName: string) {
    this.methodName = methodName
    return this
  }

  /**
   *
   */
  fromMiddlewareToken(middlewareToken: Class<MiddlewareHandling>) {
    this.middlewareToken = middlewareToken
    return this
  }

  /**
   *
   */
  build() {
    const { target, methodName, middlewareToken } = this

    const classStore = Store.from(getClass(target))

    if (!methodName) {
      // TODO: Middleware for controller
      return
    }

    if (!classStore.has('endpoints'))
      throw new Error(`An error has occurred during fetching endpoints for ${target.name}`)

    const endpoints = (classStore.get('endpoints') as Endpoint[]) || []

    const currentEndpoint = endpoints.find(endpoint => endpoint.propertyKey === methodName)

    if (!currentEndpoint)
      throw new Error(
        `No endpoint found for ${methodName} on ${target.name}, middleware must not be applied`
      )

    const { instance } = providerRegistry.resolve<MiddlewareHandling>(middlewareToken)

    currentEndpoint.addMiddleware(instance.use, instance, true)
  }

  /**
   *
   * @param target
   */
  static startFromController(target: any) {
    return new MiddlewareBuilder(target)
  }
}
