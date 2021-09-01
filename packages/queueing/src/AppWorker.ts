import { ConstructorParam, Injector, providerRegistry, Registries, Store } from '@uminily/injection'
import { LoggerService } from '@uminily/logger'
import { ConfigurationService } from '@uminily/config'
import { Class } from 'type-fest'
import { ModuleProvider } from '@uminily/common'
import { QueueManager } from './main'

// TODO: SAME CODE OF @app, PLEASE REFACTOR!
export class AppWorker {
  /**
   *
   * @param Server
   */
  static async bootstrap(Server: Class<any>) {
    const logger = await Injector.invoke(LoggerService)

    logger.separator()

    const serverStore = Store.from(Server)

    const config = serverStore.get('configuration') as Kodexo.Configuration

    const configuration = await Injector.invoke(ConfigurationService)
    configuration.applyConfig(config)

    logger.separator()

    const appModule = configuration.getOrFail('appModule')

    // TODO: Move all of that into domain to register module & start rootModule
    const RootModule = class {}

    const moduleProvider = new ModuleProvider(RootModule, [appModule, LoggerService])
    providerRegistry.registerProvider(Registries.MODULE, moduleProvider)

    //await importProviders([RootModule])

    await Injector.invoke(RootModule)

    const providersLoaded = providerRegistry.providerStates.filter(
      provider => provider.status === 'loaded'
    ).length

    const providersFound = providerRegistry.providerStates.length
    const queuesFound = Array.from(providerRegistry.queues.values()).length

    logger.separator()

    for (const provider of providerRegistry.providerStates) {
      logger.info(`[INJECTION] Status: ${provider.status} \t ${provider.name}`)
    }

    logger.separator()
    logger.info(`[INJECTION] ${providersLoaded} loaded / ${providersFound} provider(s) found`)
    logger.info(`[INJECTION] ${queuesFound} queue(s) found`)
    logger.separator()

    const serverConstructorsParams = serverStore.has('constructorParams')
      ? serverStore.get('constructorParams')
      : []

    serverConstructorsParams.sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)

    const server = new Server(
      ...serverConstructorsParams.map((param: ConstructorParam) => param.provider.instance)
    )

    if (server.afterInit) await server.afterInit()

    const queueManager = providerRegistry.getInstanceOf(QueueManager)

    queueManager.startAllWorkers()
  }
}
