import { ApiProperty } from '@kodexo/app'
import { Expose } from 'class-transformer'

export class OutputUser {
  @ApiProperty()
  @Expose()
  email: string
}
