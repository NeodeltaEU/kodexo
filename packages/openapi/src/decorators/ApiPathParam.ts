import { Store } from '@kodexo/injection'

export function ApiPathParam(description: string) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const store = Store.from(target, propertyKey, parameterIndex)
    store.set('openapi:pathParam', { description })
  }
}
