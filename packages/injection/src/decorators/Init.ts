import { getClass } from '../utils/class'
import { Store } from '../main'

export function Init() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const classStore = Store.from(getClass(target))

    if (!classStore.has('init')) classStore.set('init', propertyKey)
  }
}
