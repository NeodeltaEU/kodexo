import { Provider, ProviderOptions, ProviderType } from '@kodexo/injection'
import { Class } from 'type-fest'

import { Endpoint } from '../metadata'

/**
 *
 */
export class ServiceProvider<T = any> extends Provider<T> {
  constructor(protected currentClass: Class<T>, options: ServiceOptionsType = {}) {
    super(currentClass, ProviderType.SERVICE, options as ProviderOptions)
  }
}

export type ServiceOptionsType = {
  factory?: boolean
}
