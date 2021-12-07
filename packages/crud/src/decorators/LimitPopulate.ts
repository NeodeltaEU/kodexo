import { getClass, Request } from '@uminily/common'
import { Store } from '@uminily/injection'

export type LimitPopulateCallback = (req: Request) => Promise<boolean>

export function LimitPopulate(callback: LimitPopulateCallback) {
  return (target: any, propertyKey: string) => {
    Store.from(getClass(target), propertyKey).set('limitPopulate', callback)
  }
}
