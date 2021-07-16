import { Provider } from '@uminily/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class MiddlewareProvider<T = any> extends Provider<T> {
  constructor(protected currentClass: Class<T>, protected options: MiddlewareOptionsType = {}) {
    super(currentClass, options)
  }
}

export type MiddlewareOptionsType = {}
