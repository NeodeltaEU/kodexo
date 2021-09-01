import { Class } from 'type-fest'
import { Provider } from './Provider'

// FIXME: WTF? Is this needed ?
export type RegistryKey = Class

/**
 *
 */
export enum Registries {
  PROVIDER = 'providers',
  SERVICE = 'services',
  CONTROLLER = 'controllers',
  MIDDLEWARE = 'middlewares',
  PARAM = 'param',
  MODULE = 'modules',
  QUEUES = 'queues'
}

/**
 *
 */
export class Registry extends Map<RegistryKey, Provider> {
  private registries: Map<string, Map<RegistryKey, Provider>> = new Map()

  /**
   *
   * @param token
   * @param target
   */
  public register(registry: Registries, target: any, providerOptions?: any) {
    const provider = new Provider(target, providerOptions)
    this.registerProvider(registry, provider)
  }

  /**
   *
   * @param provider
   */
  public registerProvider(registry: Registries, provider: Provider) {
    this.findOrCreateRegistry(registry).set(provider.token, provider)
    this.set(provider.token, provider)
  }

  /**
   *
   */
  public resolve<T>(token: Class<T>): Provider<T> {
    if (!this.has(token)) throw new Error(`Missing token ${token.name} on global registry!`)
    return this.get(token) as Provider<T>
  }

  /**
   *
   */
  public getInstanceOf<T>(token: Class<T>): T {
    return this.resolve(token).instance
  }

  /**
   *
   * @param token
   */
  private findOrCreateRegistry(token: string): Map<RegistryKey, Provider> {
    if (!this.registries.has(token)) this.registries.set(token, new Map<RegistryKey, Provider>())
    return this.registries.get(token)!
  }

  /**
   *
   */
  get controllers() {
    return this.registries.get(Registries.CONTROLLER) || new Map()
  }

  /**
   *
   */
  get services(): Map<RegistryKey, Provider> {
    return this.registries.get(Registries.SERVICE) || new Map()
  }

  /**
   *
   */
  get modules(): Map<RegistryKey, Provider> {
    return this.registries.get(Registries.MODULE) || new Map()
  }

  /**
   *
   */
  get middlewares(): Map<RegistryKey, Provider> {
    return this.registries.get(Registries.MIDDLEWARE) || new Map()
  }

  /**
   *
   */
  get queues(): Map<RegistryKey, Provider> {
    return this.registries.get(Registries.QUEUES) || new Map()
  }

  /**
   *
   */
  /*get asyncServices() {
    return Array.from(this.services.values())
      .filter(provider => provider.isAsync)
      .reduce((result, provider) => {
        result.set(provider.token, provider)
        return result
      }, new Map())
  }
  get injectables() {
    return Array.from(this.values())
      .filter(provider => provider.injectable)
      .reduce((result, provider) => {
        result.set(provider.token, provider)
        return result
      }, new Map())
  }*/

  get providerStates() {
    return Array.from(this.values()).map(provider => {
      const { name, type, isInitialized } = provider

      return { name, type, status: isInitialized ? 'loaded' : 'not loaded' }
    })
  }
}

/**
 *
 */
export const providerRegistry = new Registry()
