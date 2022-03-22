import { Store } from '@kodexo/injection'
import { MethodsParams, ParamBuilder } from '../../main'

/*export function CookieParams(paramName?: string): Function {
  return (target: any, propertyKey: string, paramaterIndex: number) => {
    const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

    paramaterStore.set('type', MethodsParams.COOKIE_PARAMS)

    if (paramName) paramaterStore.set('paramName', paramName)
  }
}*/

export const CookieParams = ParamBuilder.buildParamDecorator((needed, req) => {
  return needed ? req.signedCookies[needed] : req.signedCookies
})
