import { Configuration as MikroConfiguration, Options as MikroOptions } from '@mikro-orm/core'

export * from './ConnectionDatabase'
export * from './RepositoryBuilder'
export * from './RequestContextMiddleware'

declare global {
  namespace Neatsio {
    interface Configuration {
      mikroORM: MikroOptions | MikroConfiguration
    }
  }
}
