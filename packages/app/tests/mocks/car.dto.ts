import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { ApiProperty } from '../../src/decorators/openapi/ApiProperty'

export class CarDto {
  @ApiProperty({
    description: 'Name of the car',
    example: 'Holiday Car',
    required: true
  })
  @IsString()
  @Expose()
  name: string
}
