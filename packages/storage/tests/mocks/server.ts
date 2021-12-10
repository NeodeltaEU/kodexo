import { ServerHooks } from '@uminily/app'
import { Configuration } from '@uminily/config'
import { AppModule } from './app.module'

@Configuration({
  appModule: AppModule,

  port: 4010,

  debug: {
    skipClientRequestError: true,
    displayErrorsOnServerCli: true,
    displayErrorsOnClientResponse: false
  },

  upload: {
    mainFolder: '//client-abc//',
    providers: {
      s3: {
        bucket: 'test-bucket',
        cdn: {
          enabled: true,
          endpoint: 'https://assets.acme.com'
        },
        credentials: {
          accessKeyId: 'S3RVER',
          secretAccessKey: 'S3RVER',
          region: 'local1',
          endpoint: 'http://localhost:4568'
        }
      }
    }
  },

  logs: {
    request: false
  }
})
export class Server implements ServerHooks {}
