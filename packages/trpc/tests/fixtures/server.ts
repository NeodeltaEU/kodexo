import { Configuration } from '@kodexo/config'
import { appRouter } from './app.trpc-router'
import { TestTRPCModule } from './test-trpc.module'

import '../../src/index'

@Configuration({
  appModule: TestTRPCModule,

  trpc: {
    appRouter
  }
})
export class Server {}
