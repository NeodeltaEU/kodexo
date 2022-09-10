import { RoutesService } from '@kodexo/app'
import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { AnyRouter, initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

@Service()
export class TRPCService {
  public static t = initTRPC.create()

  constructor(@Inject $routes: RoutesService, @Inject $config: ConfigurationService) {
    const appRouter = $config.getOrFail<AnyRouter>('trpc.appRouter')
    const createContext =
      $config.getOrFail<({ req, res }: trpcExpress.CreateExpressContextOptions) => {}>(
        'trpc.createContext'
      )

    console.log(appRouter)

    $routes.addCustomHandler(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
      }) as any // Handler compat between express and tinyhttp doesn't work
    )
  }
}
