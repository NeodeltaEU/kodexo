import { ParamBuilder } from '../../main'

export const RouteParams = ParamBuilder.buildParamDecorator((needed, req) => {
  return needed ? req.params[needed] : req.params
})
