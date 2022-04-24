import { Expose, Type } from 'class-transformer'
import { TransformIDToModel } from '../../../decorators/TransformIDToModel'
import { DealershipModel } from '../../dealerships/serializations/dealership.model'
import { UserModel } from '../../users/serializations/user.model'

export class CarModel {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  doors: number

  @Expose()
  registeredAt: Date | null

  @Expose()
  @Type(() => DealershipModel)
  @TransformIDToModel()
  dealership: DealershipModel | null

  @Expose()
  @Type(() => UserModel)
  @TransformIDToModel()
  owner: UserModel | null
}
