import { Provider, providerRegistry, Registries } from '@kodexo/injection'

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
