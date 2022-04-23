import { Provider, ProviderOptions, ProviderType } from '@kodexo/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class MiddlewareProvider<T = any> extends Provider<T> {
  public readonly isInterceptor

  constructor(protected currentClass: Class<T>, options: MiddlewareOptionsType = {}) {
    super(currentClass, ProviderType.MIDDLEWARE, options as ProviderOptions)

    this.isInterceptor = options.interceptor || false
  }
}

export type MiddlewareOptionsType = {
  interceptor?: boolean
}
