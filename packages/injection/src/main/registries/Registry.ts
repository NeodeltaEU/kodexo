import { Class } from 'type-fest'
import { Provider } from './Provider'

// FIXME: WTF? Is this needed ?
export type RegistryKey = Class

/**
 *
 */
export enum Registries {
  SERVICE = 'services',
  CONTROLLER = 'controllers',
  MIDDLEWARE = 'middlewares',
  PARAM = 'param'
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
  public register(registry: string, target: any, providerOptions?: any) {
    const provider = new Provider(target, providerOptions)
    this.registerProvider(registry, provider)
  }

  /**
   *
   * @param provider
   */
  public registerProvider(registry: string, provider: Provider) {
    this.findOrCreateRegistry(registry).set(provider.token, provider)
    this.set(provider.token, provider)
  }

  /**
   *
   */
  public resolve<T>(token: Class): Provider<T> {
    if (!this.has(token)) throw new Error(`Missing token ${token.name} on global registry!`)
    return this.get(token) as Provider<T>
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
  get asyncServices() {
    return Array.from(this.services.values())
      .filter(provider => provider.isAsync)
      .reduce((result, provider) => {
        result.set(provider.token, provider)
        return result
      }, new Map())
  }

  /**
   *
   */
  get injectables() {
    return Array.from(this.values())
      .filter(provider => provider.injectable)
      .reduce((result, provider) => {
        result.set(provider.token, provider)
        return result
      }, new Map())
  }
}

/**
 *
 */
export const providerRegistry = new Registry()
