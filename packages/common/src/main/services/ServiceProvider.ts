import { Provider } from '@uminily/injection'
import { Class } from 'type-fest'

import { Endpoint } from '../metadata'

/**
 *
 */
export class ServiceProvider<T = any> extends Provider<T> {
  constructor(protected currentClass: Class<T>, protected options: ServiceOptionsType = {}) {
    super(currentClass, options)
  }
}

export type ServiceOptionsType = {
  factory?: boolean
}
