import { Store } from '../main'
import { getClass } from '../utils/class'

export function OnPing() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const classStore = Store.from(getClass(target))

    if (!classStore.has('on:ping')) classStore.set('on:ping', propertyKey)
  }
}
