import { Provider, ProviderType } from '@uminily/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class ModuleProvider<T = any> extends Provider<T> {
  constructor(protected currentClass: Class<T>, imports: any[], public routing?: any) {
    super(currentClass, ProviderType.MODULE, { imports })
  }
}
