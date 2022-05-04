import { Expose } from 'class-transformer'
import { ApiProperty } from '../../../../src/decorators/openapi/ApiProperty'
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
    description: 'Registration number of the car'
  })
  @Expose()
  registration: string

  @ApiProperty()
  date: Date

  @ApiProperty()
  wheel: Wheel
}
