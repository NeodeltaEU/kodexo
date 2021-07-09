import { Store } from '@uminily/injection'

export function RouteParams(paramName?: string): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', 'RouteParams')

    if (paramName) paramaterStore.set('paramName', paramName)
  }
}
