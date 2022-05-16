import { ApiModel, ApiProperty } from '@kodexo/app'
import { Expose } from 'class-transformer'

@ApiModel({
  title: 'User'
})
export class UserSerialized {
  @ApiProperty()
  @Expose()
  email: string

  @ApiProperty()
  @Expose()
  partner: UserSerialized[]
}
