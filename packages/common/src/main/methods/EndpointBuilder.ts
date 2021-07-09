import { Store } from '@neatsio/injection'
import { RouteMethods, Endpoint } from '..'
import { getClass } from '../../utils/class'
import { isFunction } from '../../utils/functions/isFunction'

export function mapOptions(args: any[]) {
  let method: string | undefined = undefined
  let path: string | RegExp | undefined = undefined

  /*const middlewares = args.filter((arg: any) => {
    if (typeof arg === 'string' && HTTP_METHODS.includes(arg)) {
      method = arg

      return false
    }

    if (typeof arg === 'string' || arg instanceof RegExp) {
      path = arg ? arg : '/'

      return false
    }

    return !!arg
  })*/

  return {
    path,
    method
    //middlewares
  }
}

export class EndpointBuilder {
  private path: string = '/'

  private propertyKey: string

  private method: RouteMethods

  private descriptor: any

  private statusCode?: number

  private externalDecorating: boolean = false

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
   * @param statusCode
   * @returns
   */
  withStatusCode(statusCode?: number) {
    this.statusCode = statusCode
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
   */
  build() {
    const { target, propertyKey, method, path, descriptor, externalDecorating, statusCode } = this

    if (!propertyKey) throw new Error('Please use `fromProperty()` on EndpointBuilder...')

    const endpoint = new Endpoint({
      target,
      propertyKey,
      method,
      path,
      descriptor,
      externalDecorating,
      statusCode
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
    return (path: string = '/', options: any = {}) => (...args: any[]): any => {
      const [target, propertyKey, descriptor] = args

      const endpointBuilder = new EndpointBuilder(target)

      endpointBuilder
        .forPath(path)
        .withMethod(method)
        .fromProperty(propertyKey)
        .withDescriptor(descriptor)
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
