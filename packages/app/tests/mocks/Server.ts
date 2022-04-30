import { Configuration } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'
import { ServerHooks } from '../../src'
import { AppModule } from './app.module'

@Configuration({
  appModule: AppModule,

  debug: {
    displayErrorsOnServerCli: true,
    skipClientRequestError: true,
    displayErrorsOnClientResponse: true
  },

  cookies: {
    secret: 'abc'
  },

  logs: {
    request: false
  }
})
export class Server implements ServerHooks {
  constructor(@Inject private logger: LoggerService) {}
}
