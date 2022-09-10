import { Configuration } from '@kodexo/config'
import { appRouter } from './app.trpc-router'
import { TestTRPCModule } from './test-trpc.module'
import { createContext } from './trpc'

import '../../src/index'

@Configuration({
  appModule: TestTRPCModule,

  trpc: {
    appRouter,
    createContext
  }
})
export class Server {}
