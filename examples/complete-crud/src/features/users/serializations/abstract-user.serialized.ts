import { BaseSerialized } from '@kodexo/crud'
import { ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'

export class AbstractUser extends BaseSerialized {
  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@acme.com'
  })
  @Expose()
  email: string
}
