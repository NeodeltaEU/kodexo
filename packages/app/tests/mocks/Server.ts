import { Configuration } from '@uminily/config'

@Configuration({
  debug: {
    displayErrorsOnServerCli: false
  },

  logs: {
    request: false
  }
})
export class Server {}
