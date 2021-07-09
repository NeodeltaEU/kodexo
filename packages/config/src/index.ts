import { Handler } from '@tinyhttp/app'

export * from './decorators'
export * from './main'

declare global {
  namespace Neatsio {
    interface Configuration {
      port: string | number

      debugServer: boolean

      debugClient: boolean

      skipClientError: boolean

      middlewares: Handler[]
    }
  }
}
