import { t } from './trpc'

export const appRouter = t.router({
  //users: usersTRPCRouter
})

export type AppRouter = typeof appRouter
