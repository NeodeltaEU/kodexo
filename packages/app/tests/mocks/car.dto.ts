import { ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

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
