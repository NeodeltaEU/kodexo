import { EntityMetadata, MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Service } from '@uminily/common'
import { Init, Inject } from '@uminily/injection'
import { ConfigurationService } from '@uminily/config'

@Service()
export class ConnectionDatabase {
  public orm: MikroORM
  protected settings: any

  public entitiesMetadata: EntityMetadata[]

  constructor(@Inject private configurationService: ConfigurationService) {
    this.settings = this.configurationService.get('mikroORM')

    if (!this.settings) throw new Error('Mikro ORM config is not ok.')
  }

  /**
   *
   */
  @Init()
  async init() {
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
