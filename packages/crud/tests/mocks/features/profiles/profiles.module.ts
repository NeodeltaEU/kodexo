import { Module } from '@kodexo/common'
import { Profile } from './entities/profile.entity'
import { ProfilesService } from './profiles.service'

@Module({
  flags: ['profiles'],
  providers: [ProfilesService],
  entities: [Profile]
})
export class ProfilesModule {}
