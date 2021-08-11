import { Module } from '@uminily/common'
import { MikroModule } from '@uminily/mikro-orm'
import { CarsService } from './features/cars/cars.service'
import { DealershipsService } from './features/dealerships/dealerships.service'
import { ProfilesService } from './features/profiles/profiles.service'
import { UsersService } from './features/users/users.service'
import { WorkshopsService } from './features/workshops/workshops.service'
import { LogMiddleware } from './middlewares/LogMiddleware'

@Module({
  routing: {
    '/': 'tests/mocks/**/*.controller.ts'
  },
  imports: [
    CarsService,
    DealershipsService,
    ProfilesService,
    UsersService,
    WorkshopsService,
    LogMiddleware,
    MikroModule
  ]
})
export class AppModule {}
