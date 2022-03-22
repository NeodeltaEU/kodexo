import { ParamBuilder } from '@kodexo/common'

export const File = ParamBuilder.buildParamDecoratorMandatory((needed, req: any) => {
  if (!req.files[needed] || !req.files[needed].length) return null
  return req.files[needed][0]
})
