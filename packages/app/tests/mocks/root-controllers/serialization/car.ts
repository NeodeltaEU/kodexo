import { ApiProperty } from '@kodexo/openapi'
import { Expose } from 'class-transformer'
import { Wheel } from './wheel'

export class CarModel {
  @ApiProperty({ type: 'uuid' })
  @Expose()
  id: number

  @ApiProperty({
    description: 'The name of the model of the car'
  })
  @Expose()
  model: string

  @ApiProperty({
    description: 'Registration number of the car',
    example: 'EX-0090-EE'
  })
  @Expose()
  registration: string

  @ApiProperty()
  date: Date

  @ApiProperty()
  wheel: Wheel
}
