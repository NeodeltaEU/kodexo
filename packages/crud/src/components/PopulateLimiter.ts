import { Request } from '@kodexo/common'
import { Class } from 'type-fest'

export abstract class PopulateLimiter {
  abstract use(
    req: Request,
    fields: Array<string>,
    currentField: string,
    entityToken: Class
  ): Promise<Boolean>
}
