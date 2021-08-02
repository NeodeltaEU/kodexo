import { Store } from '@uminily/injection'
import { MethodsParams } from '../../main'

export function Res(): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', MethodsParams.RES)
  }
}
