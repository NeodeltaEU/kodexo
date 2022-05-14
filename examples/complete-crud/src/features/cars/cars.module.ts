import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { CarsController } from './cars.controller'
import { CarsService } from './cars.service'
import { Car } from './entities/car.entity'

@Module({
  routing: {
    '/': [CarsController]
  },
  imports: [MikroModule],
  providers: [CarsService],
  entities: [Car]
})
export class CarsModule {}
