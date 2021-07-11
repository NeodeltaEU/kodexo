import { Configuration } from '@uminily/config'
import '@uminily/mikro-orm'
import { ConnectionDatabase, RequestContextMiddleware } from '@uminily/mikro-orm'
import { ServerHooks } from '@uminily/app'
import { Car } from './features/cars/entities/car.entity'
import { Dealership } from './features/dealerships/entities/dealership.entity'
import { User } from './features/users/entities/user.entity'
import { Workshop } from './features/workshops/entities/workshop.entity'
import { Inject } from '../../../injection/dist'

@Configuration({
  port: 4000,
  mikroORM: {
    dbName: 'kodex',
    type: 'postgresql',
    user: 'kodex',
    password: 'kodex',
    port: 5433,
    entities: [Car, Workshop, Dealership, User],
    debug: false
  },
  middlewares: [RequestContextMiddleware()],
  debugClient: false,
  debugServer: true,
  skipClientError: true
})
export class Server implements ServerHooks {}
