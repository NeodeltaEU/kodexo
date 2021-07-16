import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Profile } from './entities/profile.entity'

@Service()
export class ProfilesService extends CrudService<Profile> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Profile)
  }
}
