import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Workshop } from './entities/workshop.entity'

@Service()
export class WorkshopsService extends CrudService<Workshop> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Workshop)
  }
}
