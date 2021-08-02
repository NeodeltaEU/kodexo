import { Configuration } from '@uminily/config'

@Configuration({
  debug: {
    displayErrorsOnServerCli: true,
    skipClientRequestError: true,
    displayErrorsOnClientResponse: false
  },

  cookies: {
    secret: 'abc'
  },

  logs: {
    request: false
  }
})
export class Server {}
