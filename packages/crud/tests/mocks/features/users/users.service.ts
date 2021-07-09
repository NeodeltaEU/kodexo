import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { User } from './entities/user.entity'

@Service()
export class UsersService extends CrudService<User> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, User)
  }
}
