import { Store } from '../main'
import { getClass } from '../utils/class'

export function OnClose() {
  return function (target: any, propertyKey: string) {
    const classStore = Store.from(getClass(target))
    if (!classStore.has('on:close')) classStore.set('on:close', propertyKey)
  }
}
