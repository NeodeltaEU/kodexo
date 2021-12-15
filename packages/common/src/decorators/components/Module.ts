import { Provider, providerRegistry, Registries } from '@uminily/injection'
import { Class } from 'type-fest'
import { ModuleProvider } from '../../main/modules/ModuleProvider'

export function Module(options: ModuleDecoratorOptions) {
  return (target: any) => {
    const provider = new ModuleProvider(
      target,
      options?.imports,
      options?.providers,
      options.routing,
      options?.flags,
      options?.queues || []
    )

    const { imports, routing, queues, flags, ...otherOptions } = options

    for (const otherOption in otherOptions) {
      provider[otherOption] = otherOptions[otherOption]
    }

    providerRegistry.registerProvider(Registries.MODULE, provider)
  }
}

export type ModuleDecoratorOptions = {
  imports?: any[]
  providers?: any[]
  routing?: { [key: string]: any }
  queues?: any[]

  [key: string]: any
}
