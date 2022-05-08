import { Service } from '@kodexo/common'
import { CrudService } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { User } from './entities/user.entity'

@Service()
export class UsersService extends CrudService<User> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, User)
  }
}
