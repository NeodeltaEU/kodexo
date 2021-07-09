import { Store } from '@kodexo/injection'

export function Status(statusCode: number) {
  return function (target: any, propertyKey: string, descriptor: any) {
    Store.from(target, propertyKey).set('statusCode', statusCode)
  }
}
