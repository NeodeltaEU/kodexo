import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Profile } from './entities/profile.entity'

@Service()
export class ProfilesService extends CrudService<Profile> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Profile)
  }
}
