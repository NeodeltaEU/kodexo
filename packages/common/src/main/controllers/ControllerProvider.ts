import { Provider } from '@uminily/injection'
import { Class } from 'type-fest'
import { partition } from '../..'

import { ControllerOptionsType, PathType } from '../../decorators'
import { Endpoint } from '../metadata'

/**
 *
 */
export class ControllerProvider<T = any> extends Provider<T> {
  public path: PathType

  constructor(protected currentClass: Class<T>, protected options: ControllerOptionsType) {
    super(currentClass, options)

    this.path = options.path
  }

  /**
   *
   */
  get endpoints(): Endpoint[] {
    const [external, internal] = partition(
      this.store.get('endpoints') as Endpoint[],
      endpoint => endpoint.externalDecorating
    )

    return [...internal, ...external]
  }
}
