import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { CrudService } from '../../../../src/CrudService'
import { Customer } from './entities/customer.entity'

@Service()
export class CustomersService extends CrudService<Customer> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Customer)
  }
}
