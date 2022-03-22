import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { User } from './entities/user.entity'

@Service()
export class UsersService extends CrudService<User> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, User)
  }
}
