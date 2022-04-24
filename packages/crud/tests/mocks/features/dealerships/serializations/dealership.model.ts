import { Expose, Transform, Type } from 'class-transformer'
import { TransformIDToModel } from '../../../decorators/TransformIDToModel'
import { CarModel } from '../../cars/serializations/car.model'
import { UserModel } from '../../users/serializations/user.model'

export class DealershipModel {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  @Type(() => CarModel)
  @TransformIDToModel()
  cars: CarModel[]

  @Expose()
  @Type(() => UserModel)
  @TransformIDToModel()
  customers: UserModel[]
}
