import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Module({
  imports: [MikroModule],
  providers: [UsersService],
  entities: [User]
})
export class UsersModule {}
