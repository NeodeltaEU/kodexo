import { providerRegistry, Registries } from '@uminily/injection'
import { ServiceProvider } from '../../main'

/**
 *
 * @param options
 */
export function Service(): ClassDecorator {
  return (target: any) => {
    const provider = new ServiceProvider(target)
    providerRegistry.registerProvider(Registries.SERVICE, provider)
  }
}
