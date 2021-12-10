import { ParamBuilder } from '@uminily/common'

export const MultipleFiles = ParamBuilder.buildParamDecoratorMandatory((needed, req: any) => {
  return req.files[needed]
})
