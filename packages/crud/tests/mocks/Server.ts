import { Configuration } from '@uminily/config'
import '@uminily/mikro-orm'
import { ConnectionDatabase, RequestContextMiddleware } from '@uminily/mikro-orm'
import { ServerHooks } from '@uminily/app'
import { Car } from './features/cars/entities/car.entity'
import { Dealership } from './features/dealerships/entities/dealership.entity'
import { User } from './features/users/entities/user.entity'
import { Workshop } from './features/workshops/entities/workshop.entity'

const { POSTGRES_HOST, POSTGRES_PORT } = process.env

console.log(POSTGRES_HOST, POSTGRES_PORT)

@Configuration({
  port: 4000,
  mikroORM: {
    host: POSTGRES_HOST || 'localhost',
    dbName: 'kodex',
    type: 'postgresql',
    user: 'kodex',
    password: 'kodex',
    port: parseInt(POSTGRES_PORT as string, 10) || 5433,
    entities: [Car, Workshop, Dealership, User],
    debug: true
  },
  middlewares: [RequestContextMiddleware()],

  debug: {
    skipClientRequestError: true,
    displayErrorsOnServerCli: false,
    displayErrorsOnClientResponse: false
  },

  logs: {
    request: false
  }
})
export class Server implements ServerHooks {}
