import { providerRegistry, Registries } from '@kodexo/injection'
import { TRPCRouterProvider } from '../main'

export function TRPCRouter(): ClassDecorator {
  return (target: any) => {
    const provider = new TRPCRouterProvider(target)
    providerRegistry.registerProvider(Registries.TRPC_ROUTER, provider)
  }
}
