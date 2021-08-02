import { Store } from '@uminily/injection'
import { MethodsParams } from '../../main'

export function RouteParams(paramName?: string): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', MethodsParams.ROUTE_PARAMS)

    if (paramName) paramaterStore.set('paramName', paramName)
  }
}
