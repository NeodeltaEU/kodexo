import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { CarsService } from './cars.service'
import { Car } from './entities/car.entity'

@Module({
  imports: [MikroModule],
  providers: [CarsService],
  entities: [Car]
})
export class CarsModule {}
