import { Module } from '@kodexo/common'
import { Invoice } from './entities/invoice.entity'
import { User } from './entities/user.entity'
import { LimitInvoicePopulateLimiter } from './populates/limit-invoice.populate'
import { UsersService } from './users.service'

@Module({
  flags: ['users', 'invoices'],
  providers: [UsersService, LimitInvoicePopulateLimiter],
  entities: [User, Invoice]
})
export class UsersModule {}
