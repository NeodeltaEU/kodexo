import { Provider, ProviderType } from '@uminily/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class MiddlewareProvider<T = any> extends Provider<T> {
  constructor(protected currentClass: Class<T>, options: MiddlewareOptionsType = {}) {
    super(currentClass, ProviderType.MIDDLEWARE, options)
  }
}

export type MiddlewareOptionsType = {}
