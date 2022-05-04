import { ApiProperty } from '../../../../src/decorators/openapi/ApiProperty'

export class Wheel {
  @ApiProperty({ type: 'integer' })
  size: number
}
