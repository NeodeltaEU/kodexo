import { Class } from 'type-fest'
import { providerRegistry, Provider } from '../main'

export function ensureProvider(provider: Class<any> | Provider): Provider {
  // FIXME: very bad hack
  if (
    (provider as Provider).type &&
    (provider as Provider).imports &&
    (provider as Provider).dependencies
  )
    return provider as Provider

  return providerRegistry.resolve(provider as Class)
}
