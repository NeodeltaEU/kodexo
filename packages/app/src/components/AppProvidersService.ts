import { Service } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { Inject, Injector, providerRegistry, Store } from '@uminily/injection'
import { LoggerService } from '@uminily/logger'
import { Class } from 'type-fest'
import { ServerHooks } from '..'

@Service()
export class AppProvidersService {
  public serverStore: Store

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
   * @param Server
   */
  public applyConfigFromServer(Server: Class<ServerHooks>) {
    this.serverStore = Store.from(Server)
    const config = this.serverStore.get('configuration') as Kodexo.Configuration
    this.configuration.applyConfig(config)
  }

  /**
   *
   * @returns
   */
  static async startInvokation(Server: Class<ServerHooks>) {
    const service = await Injector.invoke(AppProvidersService)

    service.logger.separator()

    service.applyConfigFromServer(Server)

    service.logger.separator()

    return service
  }
}
