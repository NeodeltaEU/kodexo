import { Configuration } from '@kodexo/config'
import '@kodexo/mikro-orm'
import { RequestContextMiddleware } from '@kodexo/mikro-orm'
import { Car } from './features/cars/entities/car.entity'
import { Dealership } from './features/dealerships/entities/dealership.entity'
import { User } from './features/users/entities/user.entity'
import { Workshop } from './features/workshops/entities/workshop.entity'

@Configuration({
  port: 4000,
  mikroORM: {
    dbName: 'kodex',
    type: 'postgresql',
    user: 'kodex',
    password: 'kodex',
    entities: [Car, Workshop, Dealership, User],
    debug: false
  },
  middlewares: [RequestContextMiddleware()],
  debugClient: false,
  debugServer: true,
  skipClientError: true
})
export class Server {}
