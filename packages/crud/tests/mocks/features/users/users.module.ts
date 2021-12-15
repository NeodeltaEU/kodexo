import { Module } from '@uminily/common'
import { Invoice } from './entities/invoice.entity'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Module({
  flags: ['users', 'invoices'],
  providers: [UsersService],
  entities: [User, Invoice]
})
export class UsersModule {}
