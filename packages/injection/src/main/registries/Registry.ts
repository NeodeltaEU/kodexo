import { Class } from 'type-fest'
import { isString } from '../../utils/cleanGlobPatterns'
import { Provider } from './Provider'

export type RegistryKey<T = any> = Class<T>

/**
 *
 */
export enum Registries {
  PROVIDER = 'providers',
  SERVICE = 'services',
  CONTROLLER = 'controllers',
  MIDDLEWARE = 'middlewares',
  INTERCEPTOR = 'interceptor',
  PARAM = 'param',
  MODULE = 'modules',
  QUEUES = 'queues'
}

/**
 *
 */
export class Registry extends Map<RegistryKey, Provider> {
  private registries: Map<string, Map<RegistryKey, Provider>> = new Map()
  private namedMap: Map<string, Provider> = new Map()

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
    if (this.namedMap.has(provider.name))
      throw new Error(`A token with ${provider.token.name} is already registered...`)

    this.findOrCreateRegistry(registry).set(provider.token, provider)
    this.set(provider.token, provider)
    this.namedMap.set(provider.name, provider)
  }

  /**
   *
   */
  public resolve<T>(token: RegistryKey<T>): Provider<T> {
    if (!this.has(token)) throw new Error(`Missing token ${token.name} on global registry!`)

    return this.get(token) as Provider<T>
  }

  /**
   *
   * @param tokenName
   * @returns
   */
  public resolveByName<T>(tokenName: string) {
    if (!this.namedMap.has(tokenName))
      throw new Error(`Missing token ${tokenName} on global registry!`)

    return this.namedMap.get(tokenName) as Provider<T>
  }

  /**
   *
   */
  public getInstanceOf<T = any>(token: string | RegistryKey<T>): T {
    const provider = isString(token) ? this.resolveByName<T>(token) : this.resolve(token)
    return provider.instance
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
  get interceptors(): Map<RegistryKey, Provider> {
    return this.registries.get(Registries.INTERCEPTOR) || new Map()
  }

  /**
   *
   */
  get mergedMiddlewares() {
    return new Map([
      ...Array.from(this.middlewares.entries()),
      ...Array.from(this.interceptors.entries())
    ])
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
