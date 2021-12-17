import { EntityMetadata, MikroORM, Options as MikroOptions } from '@mikro-orm/core'
import { ModuleProvider, Service } from '@uminily/common'
import {
  Init,
  Inject,
  Provider,
  providerRegistry,
  ProviderType,
  ensureProvider
} from '@uminily/injection'
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
    const rawMigrations: any[] = []

    const filteredModules: Set<ModuleProvider> = new Set()

    const checkSubModuleRecursive = (modules: ModuleProvider[]) => {
      modules.forEach(module => {
        filteredModules.add(module)

        const modulesDep = module.imports.filter((provider: Provider) => {
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
          const concernedSubmodules = module.imports.filter((provider: Provider) => {
            provider = ensureProvider(provider)
            return provider.type === ProviderType.MODULE
          })

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

    this.logger.info(`[MIKRO-ORM] ${this.settings.entities.length} entities loaded`)
    this.logger.info(`[MIKRO-ORM] ${this.settings.subscribers.length} subscribers loaded`)

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
