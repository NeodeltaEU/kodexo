import { ParamBuilder } from '../../main'

export const CookieParams = ParamBuilder.buildParamDecorator((needed, req) => {
  return needed ? req.signedCookies[needed] : req.signedCookies
})
