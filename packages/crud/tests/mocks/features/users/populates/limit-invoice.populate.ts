import { Injectable, Request } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { Class } from 'type-fest'
import { PopulateLimiter } from '../../../../../src'
import { UsersService } from '../users.service'

@Injectable()
export class LimitInvoicePopulateLimiter extends PopulateLimiter {
  constructor(@Inject private usersService: UsersService) {
    super()
  }

  /**
   *
   * @param req
   * @returns
   */
  async use(req: Request, fields: Array<string>, currentField: string, entityToken: Class<any>) {
    return false
  }
}
