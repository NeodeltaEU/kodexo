import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Dealership } from './entities/dealership.entity'

@Service()
export class DealershipsService extends CrudService<Dealership> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Dealership)
  }
}
