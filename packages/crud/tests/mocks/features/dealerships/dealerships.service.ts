import { Service } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@neatsio/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Dealership } from './entities/dealership.entity'

@Service()
export class DealershipsService extends CrudService<Dealership> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Dealership)
  }
}
