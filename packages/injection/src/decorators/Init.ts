import { Store } from '../main'
import { getClass } from '../utils/class'

export function Init() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const classStore = Store.from(getClass(target))

    if (!classStore.has('on:init')) classStore.set('on:init', propertyKey)
  }
}
