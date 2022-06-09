import { Handler } from '@tinyhttp/app'
import { Class } from 'type-fest'

export * from './decorators'
export * from './interfaces'
export * from './main'

declare global {
  namespace Kodexo {
    interface Configuration {
      appModule: Class<any>

      /**
       *
       */
      port: string | number

      /**
       *
       */
      middlewares: Handler[]

      /**
       *
       */
      cookies: {
        /**
         *
         */
        secret: string
      }

      debug: {
        /**
         *
         */
        displayErrorsOnServerCli: boolean

        /**
         *
         */
        displayErrorsOnClientResponse: boolean

        /**
         *
         */
        skipClientRequestError: boolean
      }

      logs: {
        /**
         *
         */
        request: boolean

        /**
         *
         */
        mute: boolean
      }

      features: {
        flags: string[]
        enabled: boolean
      }
    }
  }
}
