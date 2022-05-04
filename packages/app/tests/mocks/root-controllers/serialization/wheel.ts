import { ApiProperty } from '../../../../src/decorators/openapi/ApiProperty'

export class Wheel {
  @ApiProperty({ type: 'integer', example: 4 })
  size: number
}
