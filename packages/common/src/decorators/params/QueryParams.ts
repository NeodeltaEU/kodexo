import { ParamBuilder } from '../../main'

export const QueryParams = ParamBuilder.buildParamDecorator((needed, req) => {
  return needed ? req.query[needed] : req.query
})
