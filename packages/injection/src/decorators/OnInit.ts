import { Store } from '../main'
import { getClass } from '../utils/class'

export function OnInit() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const classStore = Store.from(getClass(target))

    if (!classStore.has('on:init')) classStore.set('on:init', propertyKey)
  }
}
