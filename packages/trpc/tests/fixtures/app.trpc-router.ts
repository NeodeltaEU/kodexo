import { TRPCService } from '../../src'
import { usersTRPCRouter } from './routers/users.trpc-router'

export const appRouter = TRPCService.t.router({
  users: usersTRPCRouter
})

export type AppRouter = typeof appRouter
