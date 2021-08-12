import { Configuration } from '@uminily/config'
import { Inject } from '@uminily/injection'
import { LoggerService } from '@uminily/logger'
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

  //async afterInit() {}
}
