import { providerRegistry } from '@kodexo/injection'
import { TRPCService } from '../../src'
import { UsersTRPCRouter } from './routers/users.trpc-router'

export const appRouter = TRPCService.t.router({
  users: providerRegistry.getInstanceOf(UsersTRPCRouter).router
})

export type AppRouter = typeof appRouter
