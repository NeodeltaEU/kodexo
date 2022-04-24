import { Expose } from 'class-transformer'
import { UserModel } from './user.model'

export class InvoiceModel {
  @Expose()
  id: string

  @Expose()
  amount: number

  @Expose()
  user: UserModel
}
