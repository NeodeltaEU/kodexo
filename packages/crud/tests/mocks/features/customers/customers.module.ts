import { Module } from '@kodexo/common'
import { CustomersService } from './customers.service'
import { Address } from './entities/address.entity'
import { Customer } from './entities/customer.entity'

@Module({
  flags: ['customers'],
  providers: [CustomersService],
  entities: [Customer, Address]
})
export class CustomersModule {}
