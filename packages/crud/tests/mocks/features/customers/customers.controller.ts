import { Controller } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { Crud, CrudControllerInterface } from '../../../../src'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from './entities/customer.entity'

@Crud({
  model: Customer,
  dto: {
    createDto: CreateCustomerDto,
    updateDto: UpdateCustomerDto
  }
})
@Controller('/customers')
export class CustomersController implements CrudControllerInterface<Customer> {
  constructor(@Inject public service: CustomersService) {}
}
