import { getClass, Request } from '@kodexo/common'
import { Store } from '@kodexo/injection'

export type LimitPopulateCallback = (req: Request) => Promise<boolean>

export function LimitPopulate(callback: LimitPopulateCallback) {
  return (target: any, propertyKey: string) => {
    Store.from(getClass(target), propertyKey).set('limitPopulate', callback)
  }
}
