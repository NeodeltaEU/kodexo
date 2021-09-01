import { Provider, ProviderType } from '@uminily/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class ModuleProvider<T = any> extends Provider<T> {
  [key: string]: any

  constructor(
    protected currentClass: Class<T>,
    imports: any[],
    public routing?: any,
    public queues: any[] = []
  ) {
    super(currentClass, ProviderType.MODULE, { imports })
  }
}
