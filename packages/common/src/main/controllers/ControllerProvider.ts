import { Middleware } from '@tinyhttp/app'
import { Provider, ProviderOptions, ProviderType } from '@kodexo/injection'
import { Class } from 'type-fest'
import { partition } from '../..'

import { ControllerOptionsType, PathType } from '../../decorators'
import { Endpoint, MiddlewareHandler } from '../metadata'

/**
 *
 */
export class ControllerProvider<T = any> extends Provider<T> {
  public path: PathType

  constructor(protected currentClass: Class<T>, options: ControllerOptionsType) {
    super(currentClass, ProviderType.CONTROLLER, options as ProviderOptions)

    this.path = options.path
  }

  /**
   *
   */
  get endpoints(): Endpoint[] {
    const [external, internal] = partition(
      (this.store.get('endpoints') as Endpoint[]) || [],
      endpoint => endpoint.externalDecorating
    )

    return [...internal, ...external]
  }

  /**
   *
   */
  get middlewares(): MiddlewareHandler[] {
    return this.store.get('middlewares') || []
  }
}
