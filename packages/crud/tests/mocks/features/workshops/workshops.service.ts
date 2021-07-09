import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Workshop } from './entities/workshop.entity'

@Service()
export class WorkshopsService extends CrudService<Workshop> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Workshop)
  }
}
