import { Controller } from '@neatsio/common'
import { Inject } from '@neatsio/injection'

import { Crud } from '../../../../src/decorators'
import { CrudControllerInterface } from '../../../../src/interfaces/CrudControllerInterface'
import { DealershipsService } from './dealerships.service'
import { CreateDealershipDto } from './dto/create-dealership.dto'
import { UpdateDealershipDto } from './dto/update-dealership.dto'
import { Dealership } from './entities/dealership.entity'

@Crud({
  model: Dealership,
  dto: {
    createDto: CreateDealershipDto,
    updateDto: UpdateDealershipDto
  }
})
@Controller('/dealerships')
export class DealershipsController implements CrudControllerInterface<Dealership> {
  constructor(@Inject public service: DealershipsService) {}
}
