import { Class } from 'type-fest'
import { ConstructorParam, IProvider } from '../../interfaces'
import { Store } from '../metadata/Store'

export enum ProviderType {
  PROVIDER = 'provider',
  MODULE = 'module',
  CONTROLLER = 'controller',
  SERVICE = 'service',
  MIDDLEWARE = 'middleware',
  QUEUE = 'queue'
}

export class Provider<T = any> implements IProvider {
  /**
   *
   */
  public readonly injectable = true

  /**
   *
   */
  public readonly name: string

  /**
   *
   */
  public readonly isAsync: boolean

  /**
   *
   */
  public readonly hasCloseCallback: boolean

  /**
   *
   */
  public readonly hasPingCallback: boolean

  /**
   *
   */
  public singleton: T

  /**
   *
   */
  protected store: Store

  /**
   *
   */
  private isFactory = false

  /**
   *
   */
  private isCallback = false

  /**
   *
   */
  public isInitialized = false

  /**
   *
   */
  public imports: any[] = []

  /**
   *
   */
  public dependencies: Provider[] = []

  /**
   *
   * @param currentClass
   */
  constructor(
    public token: Class<T>,
    public type: ProviderType = ProviderType.PROVIDER,
    protected options: ProviderOptions = {}
  ) {
    this.name = token.name
    this.store = Store.from(token)

    if (options.factory) this.isFactory = true
    //if (options.callback) this.isCallback = true

    this.isAsync = this.store.has('on:init')
    this.hasCloseCallback = this.store.has('on:close')
    this.hasPingCallback = this.store.has('on:ping')

    this.imports = this.options.imports || []

    this.dependencies = this.getConstructorParams().map((param: ConstructorParam) => param.provider)

    //console.log(this.name, this.dependencies)
  }

  /**
   *
   */
  public get instance() {
    //if (!this.singleton) this.buildSingleton()

    //if (this.isCallback) return this.singleton.callback

    if (!this.isFactory) return this.singleton
    return new this.token(
      ...this.getConstructorParams().map((param: ConstructorParam) => param.provider.instance)
    )
  }

  /**
   *

  static fromCallback(callback: Function) {
    const callbackContainer = class {
      public callback = callback
    }

    return new Provider(callbackContainer, { callback: true })
  }*/

  /**
   *
   * @returns
   */
  public async init() {
    if (this.isInitialized) return

    if (!this.isAsync) {
      this.buildSingleton()
      this.isInitialized = true
      return
    }

    const initMethod: string = this.store.get('on:init')

    this.buildSingleton()

    await (this.singleton as any)[initMethod]()

    this.isInitialized = true
  }

  /**
   *
   */
  public async close() {
    if (!this.hasCloseCallback) return

    const closeMethod: string = this.store.get('on:close')

    await (this.singleton as any)[closeMethod]()
  }

  /**
   *
   * @returns
   */
  public async ping() {
    if (!this.hasPingCallback) return

    const pingMethod: string = this.store.get('on:ping')

    return (this.singleton as any)[pingMethod]()
  }

  /**
   *
   * @returns
   */
  getConstructorParams() {
    const constructorsParams = this.store.has('constructorParams')
      ? this.store.get('constructorParams')
      : []

    constructorsParams.sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)

    return constructorsParams
  }

  /**
   *
   */
  protected buildSingleton() {
    if (!this.singleton)
      this.singleton = new this.token(
        ...this.getConstructorParams().map((param: ConstructorParam) => param.provider.instance)
      )
  }
}

export type ProviderOptions = {
  imports?: Provider[]
  factory?: boolean
}
