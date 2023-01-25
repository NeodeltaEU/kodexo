import { ErrorHandler, Handler } from '@tinyhttp/app'
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

        /**
         *
         */
        callbackOnInternalServerError?: (err: any, req: any, res: any) => void
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
