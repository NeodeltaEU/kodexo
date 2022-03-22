import { Module } from '@kodexo/common'
import { CarsService } from './cars.service'
import { Car } from './entities/car.entity'

@Module({
  flags: ['cars'],
  providers: [CarsService],
  entities: [Car]
})
export class CarsModule {}
