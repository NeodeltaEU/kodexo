import { ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'

export abstract class BaseSerialized {
  @ApiProperty({
    type: 'uuid'
  })
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date
}
