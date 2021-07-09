import { Service } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@neatsio/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Workshop } from './entities/workshop.entity'

@Service()
export class WorkshopsService extends CrudService<Workshop> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Workshop)
  }
}
