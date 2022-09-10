import { RoutesService } from '@kodexo/app'
import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { AnyRouter, initTRPC } from '@trpc/server'
import { createTinyHttpMiddleware } from '../main/adapters/tinyhttp'

@Service()
export class TRPCService {
  public static t = initTRPC.create()

  constructor(@Inject $routes: RoutesService, @Inject $config: ConfigurationService) {
    const appRouter = $config.getOrFail<AnyRouter>('trpc.appRouter')

    $routes.addCustomHandler(
      '/trpc',
      createTinyHttpMiddleware({
        router: appRouter
      })
    )
  }
}
