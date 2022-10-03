import { RoutesService } from '@kodexo/app'
import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject, OnProviderInit, Registry } from '@kodexo/injection'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { createTinyHttpMiddleware } from '../main/adapters/tinyhttp'

@Service()
export class TRPCService implements OnProviderInit {
  public static t = initTRPC.create({
    transformer: superjson
  })

  constructor(
    @Inject private readonly $routes: RoutesService,
    @Inject private readonly $config: ConfigurationService
  ) {}

  async onProviderInit(providerRegistry: Registry) {
    const appRouter = this.$config.getOrFail<any>('trpc.appRouter')

    this.$routes.addCustomHandler(
      '/trpc',
      createTinyHttpMiddleware({
        router: providerRegistry.getInstanceOf(appRouter).appRouter
      })
    )
  }
}
