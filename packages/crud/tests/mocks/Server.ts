import { ServerHooks } from '@kodexo/app'
import { Configuration } from '@kodexo/config'
import '@kodexo/mikro-orm'
import { RequestContextMiddleware } from '@kodexo/mikro-orm'
import { AppModule } from './app.module'

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
  },

  features: {
    flags: ['cars', 'dealerships', 'profiles', 'users', 'workshops'],
    enabled: true
  }
})
export class Server implements ServerHooks {}
