import { ApiModel, ApiProperty } from '@kodexo/app'
import { Expose } from 'class-transformer'

@ApiModel({
  title: 'User'
})
export class UserSerialized {
  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@acme.com'
  })
  @Expose()
  email: string

  @ApiProperty({
    items: [UserSerialized]
  })
  @Expose()
  partner: UserSerialized[]
}
