import { providerRegistry, Registries } from '@kodexo/injection'
import { ServiceProvider } from '../../main'

/**
 *
 * @param options
 */
export function Factory(): ClassDecorator {
  return (target: any) => {
    const provider = new ServiceProvider(target, { factory: true })
    providerRegistry.registerProvider(Registries.SERVICE, provider)
  }
}
