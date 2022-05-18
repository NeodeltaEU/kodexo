import { ApiModel, ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'
import { AbstractUser } from './abstract-user.serialized'

@ApiModel({
  title: 'User'
})
export class UserSerialized extends AbstractUser {
  @ApiProperty({
    items: [UserSerialized]
  })
  @Expose()
  partner: UserSerialized[]
}
