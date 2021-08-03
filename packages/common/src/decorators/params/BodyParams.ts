import { Store } from '@uminily/injection'
import { MethodsParams, ParamBuilder } from '../../main'

/*export function BodyParams(paramName?: string): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', MethodsParams.BODY_PARAMS)

    if (paramName) paramaterStore.set('paramName', paramName)
  }
}*/

export const BodyParams = ParamBuilder.buildParamDecorator((needed, req) => {
  return needed ? req.body[needed] : req.body
})
