import { Configuration } from '@uminily/config'

@Configuration({
  debug: {
    displayErrorsOnServerCli: true,
    skipClientRequestError: true,
    displayErrorsOnClientResponse: false
  },

  logs: {
    request: false
  }
})
export class Server {}
