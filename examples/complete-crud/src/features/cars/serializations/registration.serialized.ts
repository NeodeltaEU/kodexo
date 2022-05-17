import { ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'

export class RegistrationSerialized {
  @ApiProperty()
  @Expose()
  registration: string
}
