import { Module } from '@uminily/common'
import { CarsService } from './cars.service'
import { Car } from './entities/car.entity'

@Module({
  flags: ['cars'],
  providers: [CarsService],
  entities: [Car]
})
export class CarsModule {}
