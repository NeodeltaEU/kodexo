import { Configuration } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { config } from './config'

@Configuration(config)
export class Server {
  constructor(@Inject private connection: ConnectionDatabase) {}

  async afterInit() {
    const isDev = true

    if (isDev) {
      const schemaGenerator = this.connection.orm.getSchemaGenerator()
      //console.log(await schemaGenerator.getUpdateSchemaSQL())
      await schemaGenerator.updateSchema({ wrap: false })
    } else {
      const migrator = this.connection.orm.getMigrator()
      await migrator.up()
    }
  }
}
