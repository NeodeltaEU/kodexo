import { Service } from '@kodexo/common'
import { providerRegistry } from '@kodexo/injection'
import { TRPCService } from '../../src'
import { UsersTRPCRouter } from './routers/users.trpc-router'

@Service()
export class TRPCAppRouterService {
  public appRouter = TRPCService.t.router({
    users: providerRegistry.getInstanceOf(UsersTRPCRouter).router
  })

  static factory(): TRPCAppRouterService {
    // @ts-expect-error
    return null
  }
}

const instanceTypeRouter = TRPCAppRouterService.factory()
export type AppRouter = typeof instanceTypeRouter.appRouter
