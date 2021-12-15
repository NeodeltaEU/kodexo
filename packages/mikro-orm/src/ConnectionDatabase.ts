import { EntityMetadata, MikroORM, Options as MikroOptions } from '@mikro-orm/core'
import { ModuleProvider, Service } from '@uminily/common'
import { Init, Inject, Provider, providerRegistry } from '@uminily/injection'
import { ConfigurationService } from '@uminily/config'
import { LoggerService } from '@uminily/logger'
import { EntityManager } from '@mikro-orm/postgresql'

@Service()
export class ConnectionDatabase {
  public orm: MikroORM
  protected settings: MikroOptions

  public entitiesMetadata: EntityMetadata[]

  constructor(
    @Inject private configurationService: ConfigurationService,
    @Inject private logger: LoggerService
  ) {
    this.settings = this.configurationService.get('mikroORM')

    if (!this.settings) throw new Error('Mikro ORM config is not ok.')
  }

  /**
   *
   */
  @Init()
  async init() {
    const rawEntities: any[] = []
    const rawSubscribers: any[] = []

    Array.from(providerRegistry.modules.values())
      .filter(providerModule => providerModule.isInitialized)
      .forEach((providerModule: Provider) => {
        if (
          (providerModule as ModuleProvider).entities &&
          Array.isArray((providerModule as ModuleProvider).entities)
        )
          rawEntities.push(...(providerModule as ModuleProvider).entities)

        if (
          (providerModule as ModuleProvider).subscribers &&
          Array.isArray((providerModule as ModuleProvider).subscribers)
        )
          rawSubscribers.push(...(providerModule as ModuleProvider).subscribers)
      })

    const entities = [...new Set(rawEntities)]
    const subscribers = [...new Set(rawSubscribers)]

    this.settings.entities = entities
    this.settings.subscribers = subscribers.map(subscriberToken => {
      return new subscriberToken()
    })

    this.logger.info(`[MIKRO-ORM] ${subscribers.length} subscribers loaded`)

    this.logger.info(`[MIKRO-ORM] ${entities.length} entities loaded`)

    this.orm = await MikroORM.init(this.settings)

    const metadata = this.orm.em.getMetadata().getAll()

    this.entitiesMetadata = Object.values(metadata).filter(
      entityMetadata => !entityMetadata.pivotTable
    )
  }

  /**
   *
   */
  async syncSchema() {
    const generator = this.orm.getSchemaGenerator()

    await generator.dropSchema()
    await generator.createSchema()
  }

  /**
   *
   */
  async close() {
    await this.orm.close()
  }

  /**
   *
   */
  get em() {
    return this.orm.em as EntityManager
  }
}
