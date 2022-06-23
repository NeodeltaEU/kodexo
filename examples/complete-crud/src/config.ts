import { ServerConfiguration } from '@kodexo/config'
import { RequestContextMiddleware } from '@kodexo/mikro-orm'
import { LoadStrategy } from '@mikro-orm/core'
import { CompleteCrudModule } from './complete-crud.module'

export const config: ServerConfiguration = {
  appModule: CompleteCrudModule,

  mikroORM: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5400'),
    dbName: process.env.DB_NAME || 'complete-crud',
    user: process.env.DB_USER || 'complete-crud',
    password: process.env.DB_PASSWORD || 'complete-crud',
    type: 'postgresql',
    debug: false,
    loadStrategy: LoadStrategy.JOINED,
    allowGlobalContext: false,
    migrations: {
      tableName: 'migrations',
      path: './migrations',
      transactional: true,
      allOrNothing: true,
      safe: true,
      emit: 'ts',
      disableForeignKeys: false
    },
    driverOptions: {
      connection: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    }
  },

  middlewares: [RequestContextMiddleware()]
}
