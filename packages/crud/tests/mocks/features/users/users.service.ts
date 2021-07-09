import { Service } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@neatsio/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { User } from './entities/user.entity'

@Service()
export class UsersService extends CrudService<User> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, User)
  }
}
