import { Provider, providerRegistry, Registries } from '@uminily/injection'

/**
 *
 * @param options
 */
export function Injectable(): ClassDecorator {
  return (target: any) => {
    const provider = new Provider(target)
    providerRegistry.registerProvider(Registries.PROVIDER, provider)
  }
}
