import { Handler } from '@tinyhttp/app'

export * from './decorators'
export * from './main'

declare global {
  namespace Kodexo {
    interface Configuration {
      /**
       *
       */
      port: string | number

      /**
       *
       */
      middlewares: Handler[]

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
    }
  }
}
