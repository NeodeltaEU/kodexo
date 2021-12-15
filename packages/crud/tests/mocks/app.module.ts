import { Module } from '@uminily/common'
import { MikroModule } from '@uminily/mikro-orm'
import { CarsModule } from './features/cars/cars.module'
import { DealershipsModule } from './features/dealerships/dealerships.module'
import { HousesModule } from './features/houses/houses.module'
import { ProfilesModule } from './features/profiles/profiles.module'
import { UsersModule } from './features/users/users.module'
import { WorkshopsModule } from './features/workshops/workshops.module'
import { LogMiddleware } from './middlewares/LogMiddleware'

const otherModules = []

const activeOtherModule = false

if (activeOtherModule) {
  otherModules.push(HousesModule)
}

@Module({
  routing: {
    '/': 'tests/mocks/**/*.controller.ts'
  },
  imports: [
    CarsModule,
    DealershipsModule,
    ProfilesModule,
    UsersModule,
    WorkshopsModule,
    LogMiddleware,
    MikroModule,
    ...otherModules
  ]
})
export class AppModule {}
