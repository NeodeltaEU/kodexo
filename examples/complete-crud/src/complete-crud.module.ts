import { Module } from '@kodexo/common'
import { CarsModule } from './features/cars/cars.module'
import { UsersModule } from './features/users/users.module'

@Module({
  imports: [UsersModule, CarsModule]
})
export class CompleteCrudModule {}
