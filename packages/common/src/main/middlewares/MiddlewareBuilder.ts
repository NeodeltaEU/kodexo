import { providerRegistry, Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'
import { getClass } from '../../utils'
import { Endpoint } from '../metadata'
import { MiddlewareProvider } from './MiddlewareProvider'

export class MiddlewareBuilder {
  private methodName?: string
  private middlewareInstance?: MiddlewareHandling
  private args: any
  private middlewareToken: Class<MiddlewareHandling>
  private interceptor = false

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
   * @returns
   */
  isInterceptor() {
    this.interceptor = true
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
  fromInstanciedMiddleware(middleware: MiddlewareHandling) {
    this.middlewareInstance = middleware
    return this
  }

  /**
   *
   * @param args
   * @returns
   */
  withArgs(args: any) {
    this.args = args
    return this
  }

  // TODO: REFACTOR THIS, HOW CRAPPY THIS IS
  /**
   *
   * @returns
   */
  build() {
    const { target, methodName, middlewareInstance, args, middlewareToken, interceptor } = this

    const classStore = Store.from(getClass(target))

    if (!methodName) {
      if (!classStore.has('middlewares')) classStore.set('middlewares', [])
      classStore
        .get('middlewares')
        .push(
          middlewareInstance ? { instance: middlewareInstance, args } : { middlewareToken, args }
        )
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

    if (middlewareInstance) {
      interceptor
        ? currentEndpoint.addInstanciedInterceptor(middlewareInstance, args)
        : currentEndpoint.addInstanciedMiddleware(middlewareInstance, args)

      return
    }

    const provider = providerRegistry.get(middlewareToken)

    if (!provider)
      throw new Error(`Middleware/Interceptor ${middlewareToken.name} not found in registry`)

    if ((provider as MiddlewareProvider).isInterceptor) {
      currentEndpoint.addInterceptor(middlewareToken, args)
    } else {
      currentEndpoint.addMiddleware(middlewareToken, args)
    }
  }

  /**
   *
   * @param target
   */
  static startFromController(target: any) {
    return new MiddlewareBuilder(target)
  }
}
