import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Dealership } from './entities/dealership.entity'

@Service()
export class DealershipsService extends CrudService<Dealership> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Dealership)
  }
}
