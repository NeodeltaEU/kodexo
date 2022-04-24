import { Controller, Post, UseSerialization } from '@kodexo/common'
import { SerializerInterceptor } from '@kodexo/common/src/main/middlewares'
import { Inject } from '@kodexo/injection'

import { Crud } from '../../../../src/decorators'
import { CrudControllerInterface } from '../../../../src/interfaces/CrudControllerInterface'
import { DealershipsService } from './dealerships.service'
import { CreateDealershipDto } from './dto/create-dealership.dto'
import { UpdateDealershipDto } from './dto/update-dealership.dto'
import { Dealership } from './entities/dealership.entity'
import { DealershipModel } from './serializations/dealership.model'

@Crud({
  model: Dealership,
  dto: {
    createDto: CreateDealershipDto,
    updateDto: UpdateDealershipDto
  },
  interceptors: {
    getOne: [SerializerInterceptor.forModel(DealershipModel)]
  }
})
@Controller('/dealerships')
export class DealershipsController implements CrudControllerInterface<Dealership> {
  constructor(@Inject public service: DealershipsService) {}
}
