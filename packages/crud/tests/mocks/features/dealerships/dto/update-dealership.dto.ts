import { Transform } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'
import { isObject } from '../../../../../../common/src'
import { Association, IsExist } from '../../../../../src'
import { Car } from '../../cars/entities/car.entity'
import { User } from '../../users/entities/user.entity'

export class UpdateDealershipDto {
  title: string

  @IsOptional()
  @IsExist(User, { each: true })
  customers: Array<Association<User>>

  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(subvalue => identify(subvalue))
    return identify(value)
  })
  @IsOptional()
  @IsExist(Car, { each: true })
  cars: Array<Association<Car>>
}

function identify(value: any) {
  if (isObject(value)) return value.id
  return value
}
