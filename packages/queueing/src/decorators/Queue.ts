import { providerRegistry, Registries } from '@kodexo/injection'
import { QueueProvider } from '../components/QueueProvider'

export function Queue(name: string, options?: any): ClassDecorator {
  return function (target: any) {
    const provider = new QueueProvider(target, name)
    providerRegistry.registerProvider(Registries.QUEUES, provider)
  }
}
