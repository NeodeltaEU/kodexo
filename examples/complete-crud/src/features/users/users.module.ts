import { Module } from '@kodexo/common'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  routing: {
    '/': [UsersController]
  },
  providers: [UsersService],
  entities: [User]
})
export class UsersModule {}
