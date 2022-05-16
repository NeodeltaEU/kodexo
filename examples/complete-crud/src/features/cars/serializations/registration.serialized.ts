import { ApiProperty } from '@kodexo/app'
import { Expose } from 'class-transformer'

export class RegistrationSerialized {
  @ApiProperty()
  @Expose()
  registration: string
}
