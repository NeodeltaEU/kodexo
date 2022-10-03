import { Configuration } from '@kodexo/config'
import { TestTRPCModule } from './test-trpc.module'

import '../../src/index'
import { TRPCAppRouterService } from './app.trpc-router'

@Configuration({
  appModule: TestTRPCModule,
  trpc: {
    appRouter: TRPCAppRouterService
  }
})
export class Server {}
