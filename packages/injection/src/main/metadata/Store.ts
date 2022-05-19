import { DevError } from '@kodexo/errors'
import { mergeDeepLeft } from 'ramda'
import 'reflect-metadata'
import { DecoratorTypes, getDecoratorType } from '../../utils'

function getAncestors(target: Function): Function[] {
  const ancestors: Function[] = []
  for (
    let baseClass = Object.getPrototypeOf(target.prototype.constructor);
    typeof baseClass.prototype !== 'undefined';
    baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)
  ) {
    ancestors.push(baseClass)
  }
  return ancestors
}

/**
 *
 */
export class Store {
  private content = new Map<string, any>()
  private heritedStores: Store[] = []

  constructor(args: any[]) {
    this.content = this.getMetadataFromArgs(args)
  }

  /**
   *
   * @param args
   */
  private getMetadataFromArgs(args: any[]) {
    const [target, propertyKey, descriptorOrIndex] = args

    const getMetadata = (key: string) => {
      if (!Reflect.hasOwnMetadata(key, target, propertyKey))
        Reflect.defineMetadata(key, new Map<string, any>(), target, propertyKey)

      return Reflect.getOwnMetadata(key, target, propertyKey)
    }

    switch (getDecoratorType(args)) {
      case DecoratorTypes.CONSTRUCTOR_PARAMETER:
      case DecoratorTypes.STATIC_PARAMETER:
      case DecoratorTypes.PARAMETER:
        const store = getMetadata('kodexo:parameters')
        if (!store.has(descriptorOrIndex)) store.set(descriptorOrIndex, new Map<string, any>())
        return store.get(descriptorOrIndex)

      case DecoratorTypes.PROPERTY:
      case DecoratorTypes.STATIC_PROPERTY:
        return getMetadata('kodexo:properties')

      case DecoratorTypes.METHOD:
      case DecoratorTypes.STATIC_METHOD:
        return getMetadata('kodexo:methods')

      case DecoratorTypes.CLASS:
        return getMetadata('kodexo:class')

      default:
        throw new Error('An error occured when getting metadata from decorators arguments')
    }
  }

  /**
   *
   * @param args
   */
  static from(...args: any[]) {
    return new Store(args)
  }

  /**
   *
   * @param target
   * @returns
   */
  static fromClass(target: Function) {
    const stores = getAncestors(target).map(ancestor => Store.from(ancestor))

    const store = new Store([target])

    store.addHeritedStores(stores)

    return store
  }

  /**
   *
   */
  get size() {
    return this.content.size
  }

  /**
   *
   * @param key
   */
  get<T = any>(key: string) {
    return this.content.get(key) as T
  }

  /**
   *
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    return this.content.set(key, value)
  }

  /**
   *
   * @param key
   */
  has(key: string): boolean {
    return this.content.has(key)
  }

  /**
   *
   */
  mergeFromHerited(key: string): this {
    //if (!this.has(key)) return this

    const value = this.get(key)

    const herited = this.heritedStores.reverse().reduce((result: any, store) => {
      if (!result) {
        return { ...store.get(key) }
      }
      if (!store.has(key)) return result

      if (Array.isArray(result) || typeof result !== 'object') {
        throw new DevError(`Cannot merge a non object value on key store ${key}`)
      }
      return mergeDeepLeft(result, store.get(key))
    }, null)

    this.set(key, mergeDeepLeft(value ?? {}, herited ?? {}))

    return this
  }

  /**
   *
   * @param store
   */
  addHeritedStores(store: Store[]) {
    this.heritedStores.push(...store)
  }
}
