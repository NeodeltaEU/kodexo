import { Module } from '@kodexo/common'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService],
  entities: [User]
})
export class UsersModule {}
