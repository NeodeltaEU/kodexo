import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { MiddlewareHandler } from '.'
import { Endpoint, RouteMethods } from '..'
import { Dictionnary, MiddlewareHandling } from '../../interfaces'
import { getClass } from '../../utils/class'
import { isFunction } from '../../utils/functions/isFunction'

function isMiddlewareInstance(
  token: Class<MiddlewareHandling> | MiddlewareHandling
): token is MiddlewareHandling {
  return !!(token as any).use
}

export type MethodDecoratorOptions = Partial<{
  action: string
  stream: boolean
}>

export class EndpointBuilder {
  private path: string = '/'

  private propertyKey: string

  private method: RouteMethods

  private descriptor: any

  private statusCode?: number

  private externalDecorating: boolean = false

  private middlewares: MiddlewareHandler[]

  private interceptors: MiddlewareHandler[]

  private headers: Dictionnary = {}

  private isStream = false

  private action?: string

  constructor(private target: any) {
    if (!target) throw new Error('A target must be a controller to create an endpoint')
  }

  /**
   *
   * @param path
   */
  forPath(path: string = '/') {
    this.path = path
    return this
  }

  /**
   *
   * @param method
   */
  withMethod(method: RouteMethods) {
    this.method = method
    return this
  }

  /**
   *
   * @param descriptor
   * @returns
   */
  withDescriptor(descriptor: any) {
    const isDescriptor = !!descriptor?.value

    if (!isDescriptor && !isFunction(descriptor))
      throw new Error('This is not definition of a descriptor for Endpoint Builder')

    this.descriptor = isFunction(descriptor) ? { value: descriptor } : descriptor

    return this
  }

  /**
   *
   * @param interceptors
   * @returns
   */
  withInterceptors(interceptors: Array<Class<MiddlewareHandling> | MiddlewareHandling>) {
    this.interceptors = interceptors.map(interceptor => {
      return isMiddlewareInstance(interceptor)
        ? {
            instance: interceptor
          }
        : {
            middlewareToken: interceptor
          }
    })

    return this
  }

  /**
   *
   */
  withMiddlewares(middlewares: Array<Class<MiddlewareHandling> | MiddlewareHandling>) {
    this.middlewares = middlewares.map(middleware => {
      return isMiddlewareInstance(middleware)
        ? {
            instance: middleware
          }
        : {
            middlewareToken: middleware
          }
    })

    return this
  }

  /**
   *
   * @param statusCode
   * @returns
   */
  withStatusCode(statusCode?: number) {
    this.statusCode = statusCode
    return this
  }

  /**
   *
   * @param name
   * @returns
   */
  withAction(action?: string) {
    if (!action) return this

    this.action = action
    return this
  }

  /**
   *
   * @param property
   * @returns
   */
  fromProperty(property: string) {
    this.propertyKey = property

    return this
  }

  /**
   *
   */
  fromExternalDecorator() {
    this.externalDecorating = true
    return this
  }

  /**
   *
   * @param isStream
   * @returns
   */
  asStream(isStream?: boolean) {
    this.isStream = isStream ?? false
    return this
  }

  /**
   *
   */
  addHeader(key: string, value: string) {
    this.headers[key] = value
  }

  /**
   *
   */
  addHeaders(headers: Dictionnary) {
    this.headers = { ...this.headers, ...headers }
  }

  /**
   *
   */
  build() {
    const {
      target,
      propertyKey,
      method,
      path,
      descriptor,
      externalDecorating,
      statusCode,
      middlewares,
      interceptors,
      isStream,
      action
    } = this

    if (!propertyKey) throw new Error('Please use `fromProperty()` on EndpointBuilder...')

    const endpoint = new Endpoint({
      target,
      propertyKey,
      method,
      path,
      descriptor,
      externalDecorating,
      statusCode,
      middlewares,
      interceptors,
      isStream,
      action: action || propertyKey
    })

    const classStore = Store.from(getClass(target))

    if (!classStore.has('endpoints')) classStore.set('endpoints', [])

    classStore.get('endpoints').push(endpoint)

    return endpoint
  }

  /**
   *
   * @param method
   * @returns
   */
  static buildDecoratorMethod(method: RouteMethods) {
    return (path: string = '/', options: MethodDecoratorOptions = {}) =>
      (...args: any[]): any => {
        const [target, propertyKey, descriptor] = args

        const endpointBuilder = new EndpointBuilder(target)

        endpointBuilder
          .forPath(path)
          .fromProperty(propertyKey)
          .withMethod(method)
          .withAction(options?.action)
          .withDescriptor(descriptor)
          .asStream(options?.stream)
          .build()
      }
  }

  /**
   *
   * @param target
   * @returns
   */
  static startWithController(target: any) {
    return new EndpointBuilder(target)
  }
}
