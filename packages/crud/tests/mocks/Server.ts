import { ServerHooks } from '@uminily/app'
import { Configuration } from '@uminily/config'
import '@uminily/mikro-orm'
import { RequestContextMiddleware } from '@uminily/mikro-orm'
import { Class } from 'type-fest'
import { AppModule } from './app.module'
import { Car } from './features/cars/entities/car.entity'
import { Dealership } from './features/dealerships/entities/dealership.entity'
import { Profile } from './features/profiles/entities/profile.entity'
import { User } from './features/users/entities/user.entity'
import { Workshop } from './features/workshops/entities/workshop.entity'

const { POSTGRES_HOST, POSTGRES_PORT } = process.env

@Configuration({
  appModule: AppModule,
  port: 4000,
  mikroORM: {
    host: POSTGRES_HOST || 'localhost',
    dbName: 'kodex',
    type: 'postgresql',
    user: 'kodex',
    password: 'kodex',
    port: parseInt(POSTGRES_PORT as string, 10) || 5433,
    debug: false
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
