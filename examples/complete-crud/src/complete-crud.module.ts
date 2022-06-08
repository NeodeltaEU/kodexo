import { Module } from '@kodexo/common'
import * as Path from 'path'
import { CarsModule } from './features/cars/cars.module'
import { UsersModule } from './features/users/users.module'

const controllers = Path.resolve(__dirname + '/features/**/*.controller.{ts,js}')

@Module({
  routing: {
    '/': [controllers]
  },
  imports: [UsersModule, CarsModule]
})
export class CompleteCrudModule {}
