import { Provider, providerRegistry, Registries } from '@uminily/injection'
import { ModuleProvider, pMap } from '@uminily/common'
import { Class } from 'type-fest'

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
    await pMap(
      provider.imports,
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
