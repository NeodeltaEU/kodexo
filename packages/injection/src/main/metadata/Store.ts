import 'reflect-metadata'
import { DecoratorTypes, getDecoratorType } from '../../utils'

/**
 *
 */
export class Store {
  private content = new Map<string, any>()

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
}
