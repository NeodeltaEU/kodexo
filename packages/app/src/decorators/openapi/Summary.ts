import { Store } from '@kodexo/injection'

export function Summary(message: string = '') {
  return (target: any, propertyKey: string | symbol, descriptor: any) => {
    Store.from(target, propertyKey, descriptor).set('summary', message)
  }
}
