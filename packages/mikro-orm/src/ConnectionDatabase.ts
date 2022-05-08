import { ModuleProvider, Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import {
  ensureProvider,
  Inject,
  OnClose,
  OnInit,
  Provider,
  providerRegistry,
  ProviderType
} from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'
import { EntityMetadata, MikroORM, Options as MikroOptions } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'

@Service()
export class ConnectionDatabase {
  public orm: MikroORM
  public entitiesMetadata: EntityMetadata[]
  protected settings: MikroOptions

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
  @OnInit()
  async init() {
    this.extractFromModules()
    await this.connect()
    this.extractMetadataFromEntities()
  }

  private async connect() {
    this.logger.info(`[MIKRO-ORM] Connecting to database...`)
    this.orm = await MikroORM.init(this.settings)
    this.logger.info(`[MIKRO-ORM] Database connected`)
  }

  /**
   *
   */
  private extractFromModules() {
    this.logger.info(`[MIKRO-ORM] Initializing...`)

    const rawEntities: any[] = []
    const rawSubscribers: any[] = []
    const rawMigrations: any[] = []

    const filteredModules: Set<ModuleProvider> = new Set()

    const checkSubModuleRecursive = (modules: ModuleProvider[]) => {
      modules.forEach(module => {
        filteredModules.add(module)

        const modulesDep = module.imports
          .map((provider: any) => (provider = ensureProvider(provider)))
          .filter((provider: Provider) => {
            provider = ensureProvider(provider)
            return provider.type === ProviderType.MODULE
          })

        checkSubModuleRecursive(modulesDep as ModuleProvider[])
      })
    }

    const features = this.configurationService.get('features.enabled')
      ? [...this.configurationService.getOrFail<string[]>('features.flags')]
      : null

    Array.from(providerRegistry.modules.values())
      .filter((module: Provider) => {
        if (!features) return true

        const intersectFlags =
          features.filter(x => (module as ModuleProvider).flags?.includes(x)).length > 0

        if (intersectFlags) {
          const concernedSubmodules = module.imports
            .map((provider: any) => (provider = ensureProvider(provider)))
            .filter((provider: Provider) => provider.type === ProviderType.MODULE)

          checkSubModuleRecursive(concernedSubmodules as ModuleProvider[])

          return true
        }

        return false
      })
      .forEach(module => filteredModules.add(module as ModuleProvider))

    Array.from(filteredModules).forEach(providerModule => {
      if (Array.isArray(providerModule.entities)) rawEntities.push(...providerModule.entities)

      if (Array.isArray(providerModule.subscribers))
        rawSubscribers.push(...providerModule.subscribers)

      if (Array.isArray(providerModule.migrations)) rawMigrations.push(...providerModule.migrations)
    })

    this.settings.entities = [...new Set(rawEntities)]

    this.settings.subscribers = [...new Set(rawSubscribers)].map(subscriberToken => {
      return new subscriberToken()
    })

    this.settings.migrations = {
      migrationsList: [...new Set(rawMigrations)]
    }

    this.logger.info(
      `[MIKRO-ORM] ${this.settings.entities.length} ${
        this.settings.entities.length > 1 ? 'entities' : 'entity'
      } loaded`
    )
    this.logger.info(`[MIKRO-ORM] ${this.settings.subscribers.length} subscriber(s) loaded`)
  }

  /**
   *
   */
  private extractMetadataFromEntities() {
    const metadata = this.orm.em.getMetadata().getAll()

    this.logger.info(`[MIKRO-ORM] Extract models metadata...`)

    this.entitiesMetadata = Object.values(metadata).filter(
      entityMetadata => !entityMetadata.pivotTable
    )

    this.logger.info(`[MIKRO-ORM] Metadata loaded`)
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
  @OnClose()
  async close() {
    console.log('close database')
    await this.orm.close()
  }

  /**
   *
   */
  get em() {
    return this.orm.em as EntityManager
  }
}
