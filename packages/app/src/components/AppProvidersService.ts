import { ModuleProvider, pMap, Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import {
  ConstructorParam,
  importProviders,
  Inject,
  Injector,
  IProvider,
  Provider,
  providerRegistry,
  ProviderType,
  Registries,
  Store
} from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'
import { OpenApiService } from '@kodexo/openapi'
import { QueueManager } from '@kodexo/queueing'
import { Class } from 'type-fest'
import { ServerHooks } from '..'
import { RoutesService } from './RoutesService'

@Service()
export class AppProvidersService {
  private serverStore: Store
  public routing: IProvider[]

  constructor(
    @Inject public logger: LoggerService,
    @Inject public configuration: ConfigurationService
  ) {}

  /**
   *
   */
  public getInstanceProvider(token: string | Class<any>) {
    const instance = providerRegistry.getInstanceOf(token)
    return instance
  }

  /**
   *
   */
  public getLoadedProviders(): Provider[] {
    return Array.from(providerRegistry.values()).filter(provider => provider.isInitialized)
  }

  /**
   *
   * @param Server
   */
  public applyConfigFromServer(Server: Class<ServerHooks>) {
    this.serverStore = Store.from(Server)
    const config = this.serverStore.get('configuration') as Kodexo.Configuration
    this.configuration.applyConfig(config)
  }

  /**
   *
   */
  public async importsProviders() {
    const RootModule = this.createRootModule()

    const tokenProviders = await importProviders([RootModule])

    // Isolating controllers
    this.routing = tokenProviders.filter(provider => provider.route)

    await Injector.invoke(RootModule)

    await pMap(this.routing, async provider => {
      await Injector.invoke(provider.token)
    })

    return this.getProvidersStats()
  }

  /**
   *
   * @param routing
   * @returns
   */
  private getProvidersStats() {
    const stats = {
      loaded: 0,
      found: 0,
      queues: 0,
      controllers: this.routing.length
    }

    return providerRegistry.providerStates.reduce((result, provider) => {
      if (provider.status === 'loaded') result.loaded++
      if (provider.status === 'loaded' && provider.type === ProviderType.QUEUE) result.queues++

      result.found++

      return result
    }, stats)
  }

  /**
   *
   */
  private createRootModule() {
    const AppModule = this.configuration.getOrFail<Class>('appModule')

    const RootModule = class {}

    const rootModuleProvider = new ModuleProvider(RootModule, [
      AppModule,
      LoggerService,
      ConfigurationService,
      RoutesService,
      OpenApiService
    ])

    providerRegistry.registerProvider(Registries.MODULE, rootModuleProvider)

    return RootModule
  }

  /**
   *
   */
  public async executeClose() {
    await Promise.all(Array.from(providerRegistry.values()).map(provider => provider.close()))
  }

  /**
   *
   */
  public buildServer(Server: Class<ServerHooks>) {
    const serverConstructorsParams = this.serverStore.has('constructorParams')
      ? this.serverStore.get('constructorParams')
      : []

    serverConstructorsParams.sort((a: any, b: any) => a.parameterIndex - b.parameterIndex)

    const server = new Server(
      ...serverConstructorsParams.map((param: ConstructorParam) => param.provider.instance)
    )

    return server
  }

  /**
   *
   */
  public async applyProviderInitHooks() {
    await pMap(this.getLoadedProviders(), provider => provider.onProviderInit())
  }

  /**
   *
   * @returns
   */
  static async startServer(Server: Class<ServerHooks>) {
    const service = await Injector.invoke(AppProvidersService)

    const { logger } = service

    // Apply config
    logger.separator()
    service.applyConfigFromServer(Server)
    logger.separator()

    const { loaded, found, controllers, queues } = await service.importsProviders()

    await service.applyProviderInitHooks()

    logger.separator()
    for (const provider of providerRegistry.providerStates) {
      logger.info(`[INJECTION] Status: ${provider.status} \t ${provider.name}`)
    }
    logger.separator()
    logger.info(`[INJECTION] ${loaded} loaded / ${found} provider(s) found`)
    logger.info(`[INJECTION] ${controllers} controller(s) found`)
    logger.info(`[INJECTION] ${queues} queue(s) found`)
    logger.separator()

    const server = service.buildServer(Server)

    // TODO: not good place
    if (queues) {
      const queueManager = providerRegistry.getInstanceOf(QueueManager)
      queueManager.prepareQueues()
    }

    //
    if (server.afterInit) await server.afterInit()

    return server
  }
}
