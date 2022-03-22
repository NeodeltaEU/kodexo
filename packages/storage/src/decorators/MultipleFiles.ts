import { ParamBuilder } from '@kodexo/common'

export const MultipleFiles = ParamBuilder.buildParamDecoratorMandatory((needed, req: any) => {
  return req.files[needed]
})
