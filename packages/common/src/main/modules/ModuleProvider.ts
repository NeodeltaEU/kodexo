import { Provider, ProviderType } from '@kodexo/injection'
import { Class } from 'type-fest'

/**
 *
 */
export class ModuleProvider<T = any> extends Provider<T> {
  [key: string]: any

  constructor(
    protected currentClass: Class<T>,
    imports: any[] = [],
    public providers: any[] = [],
    public routing?: any,
    public flags: string[] = [],
    public queues: any[] = []
  ) {
    super(currentClass, ProviderType.MODULE, { imports })
  }
}
