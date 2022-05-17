import { ApiProperty } from '@kodexo/openapi'

export class Wheel {
  @ApiProperty({ type: 'integer', example: 4 })
  size: number
}
