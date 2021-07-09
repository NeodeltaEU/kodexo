import { Transform } from 'class-transformer'
import { IsString, Length } from 'class-validator'
import { isObject } from '../../../../../../common/src'
import { Association, IsExist } from '../../../../../src'
import { User } from '../../users/entities/user.entity'

export class CreateCarDto {
  @Length(10)
  @IsString()
  title: string

  @Transform(({ value }) => {
    if (isObject(value)) return value.id
    return value
  })
  @IsExist(User)
  owner?: Association<User>
}
