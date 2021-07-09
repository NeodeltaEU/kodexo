import { Store } from '@neatsio/injection'

export function BodyParams(paramName?: string): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', 'BodyParams')

    if (paramName) paramaterStore.set('paramName', paramName)
  }
}
