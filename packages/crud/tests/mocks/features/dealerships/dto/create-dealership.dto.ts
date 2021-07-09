import { Transform } from 'class-transformer'
import { IsOptional, Length } from 'class-validator'
import { isObject } from '../../../../../../common/src'
import { Association, IsExist } from '../../../../../src'
import { User } from '../../users/entities/user.entity'

export class CreateDealershipDto {
  @Length(10)
  title: string

  @IsOptional()
  @Transform(({ value }) => {
    if (isObject(value)) return value.id
    return value
  })
  @IsExist(User, { each: true })
  customers: Array<Association<User>>
}
