import { providerRegistry, Store } from '../main'

export function Inject(target: any, propertyName: string): any
export function Inject(target: any, propertyName: string, parameterIndex?: number): any

/**
 *
 * @param target
 * @param propertyName
 */
export function Inject(target: any, propertyName: string, parameterIndex?: number): any {
  const isConstructorParam = !propertyName && Number.isInteger(parameterIndex)

  let meta

  if (isConstructorParam) {
    const types = Reflect.getMetadata('design:paramtypes', target, propertyName)

    meta = types[parameterIndex as number]

    const provider = providerRegistry.resolve(meta)

    const classStore = Store.from(target)

    if (!classStore.has('constructorParams')) classStore.set('constructorParams', [])

    classStore.get('constructorParams').push({
      parameterIndex,
      provider
    })
  } else {
    meta = Reflect.getMetadata('design:type', target, propertyName)

    const provider = providerRegistry.resolve(meta)

    Object.defineProperty(target, propertyName, {
      get: () => provider?.instance,
      enumerable: true,
      configurable: true
    })
  }
}
