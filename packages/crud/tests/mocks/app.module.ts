import { Module } from '@uminily/common'
import { MikroModule } from '@uminily/mikro-orm'
import { CarsService } from './features/cars/cars.service'
import { Car } from './features/cars/entities/car.entity'
import { DealershipsService } from './features/dealerships/dealerships.service'
import { Dealership } from './features/dealerships/entities/dealership.entity'
import { Invoice } from './features/invoices/entities/invoice.entity'
import { Profile } from './features/profiles/entities/profile.entity'
import { ProfilesService } from './features/profiles/profiles.service'
import { User } from './features/users/entities/user.entity'
import { UsersService } from './features/users/users.service'
import { Workshop } from './features/workshops/entities/workshop.entity'
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
  ],
  entities: [Car, Workshop, Dealership, User, Profile, Invoice]
})
export class AppModule {}
