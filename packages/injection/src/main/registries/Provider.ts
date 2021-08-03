import { Class } from 'type-fest'
import { ConstructorParam } from '../../interfaces'
import { Store } from '../metadata/Store'

export class Provider<T = any> {
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
  private isInitialized = false

  /**
   *
   * @param currentClass
   */
  constructor(public token: Class<T>, protected options: any = {}) {
    this.name = token.name
    this.store = Store.from(token)

    if (options.factory) this.isFactory = true
    if (options.callback) this.isCallback = true

    this.isAsync = this.store.has('init')
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
    if (!this.isAsync || this.isInitialized) return

    const initMethod: string = this.store.get('init')

    this.buildSingleton()

    await (this.singleton as any)[initMethod]()

    this.isInitialized = true
  }

  /**
   *
   */
  protected buildSingleton() {
    const constructorsParams = this.store.has('constructorParams')
      ? this.store.get('constructorParams')
      : []

    constructorsParams.sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)

    if (!this.singleton)
      this.singleton = new this.token(
        ...constructorsParams.map((param: ConstructorParam) => param.provider.instance)
      )
  }

  /**
   *
   */
  public get instance() {
    if (!this.singleton) this.buildSingleton()

    //if (this.isCallback) return this.singleton.callback

    if (!this.isFactory) return this.singleton
    return new this.token()
  }
}
