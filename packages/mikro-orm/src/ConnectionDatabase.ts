import { EntityMetadata, MikroORM, Options as MikroOptions } from '@mikro-orm/core'
import { ModuleProvider, Service } from '@uminily/common'
import { Init, Inject, Provider, providerRegistry } from '@uminily/injection'
import { ConfigurationService } from '@uminily/config'
import { LoggerService } from '@uminily/logger'
import { isArray } from 'lodash'

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
    const entities = (() => {
      const rawEntities: any[] = []

      Array.from(providerRegistry.modules.values()).forEach((providerModule: Provider) => {
        if (
          !(providerModule as ModuleProvider).entities ||
          !isArray((providerModule as ModuleProvider).entities)
        )
          return

        rawEntities.push(...(providerModule as ModuleProvider).entities)
      })

      return [...new Set(rawEntities)]
    })()

    this.settings.entities = entities

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
}
