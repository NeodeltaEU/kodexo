import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  routing: {
    '/': [UsersController]
  },
  imports: [MikroModule],
  providers: [UsersService],
  entities: [User]
})
export class UsersModule {}
