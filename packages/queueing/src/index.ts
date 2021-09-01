import { ConnectionOptions } from 'bullmq'

export * from './decorators'
export * from './queueing.module'
export * from './interfaces'
export * from './main'

export * from './AppWorker'

declare global {
  namespace Kodexo {
    interface Configuration {
      bull: {
        connection: ConnectionOptions
      }
    }
  }
}
