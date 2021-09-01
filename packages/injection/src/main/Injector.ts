import { pMap } from '../utils'
import { Class } from 'type-fest'
import { Provider, providerRegistry, Registries } from './registries'

export class Injector {
  public async invokeLocally(token: any) {
    const provider = this.ensureProvider(token)

    //console.log({ name: provider.name, deps: provider.dependencies, imports: provider.imports })

    await pMap(provider.dependencies, async depProvider => {
      await this.resolve(depProvider)
    })

    const instance = await this.resolve(provider)

    return instance
  }

  /**
   *
   */
  private async resolve(provider: Provider) {
    const queues = (provider as any).queues || []

    await pMap(
      [...provider.imports, ...queues],
      async token => {
        await this.invokeLocally(token)
      },
      { concurrency: 1 }
    )

    await provider.init()

    //console.log({ provider })

    return provider.instance
  }

  /**
   *
   */
  private ensureProvider(token: any): Provider {
    if (!providerRegistry.has(token)) {
      providerRegistry.register(Registries.PROVIDER, token)
    }

    return providerRegistry.resolve(token)
  }

  /**
   *
   */
  static async invoke<T>(token: Class<T>): Promise<T> {
    const injector = new Injector()

    return injector.invokeLocally(token)
  }
}
