import { ApiProperty } from '@kodexo/app'
import { Expose } from 'class-transformer'

export class UserSerialized {
  @ApiProperty()
  @Expose()
  email: string
}
