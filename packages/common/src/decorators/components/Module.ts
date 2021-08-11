import { Provider, providerRegistry, Registries } from '@uminily/injection'
import { Class } from 'type-fest'
import { ModuleProvider } from '../../main/modules/ModuleProvider'

export function Module(options: ModuleDecoratorOptions) {
  return (target: any) => {
    const provider = new ModuleProvider(target, options.imports, options.routing)
    providerRegistry.registerProvider(Registries.MODULE, provider)
  }
}

export type ModuleDecoratorOptions = {
  imports: any[]
  routing?: { [key: string]: any }
}
