import { Configuration } from '@kodexo/config'
import { QueueTestModule } from './queue-test.module'

@Configuration({
  appModule: QueueTestModule,
  bull: {
    connection: {
      host: 'localhost',
      port: 6379
    }
  }
})
export class Server {}
