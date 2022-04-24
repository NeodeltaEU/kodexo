import { Controller } from '@kodexo/common'
import { SerializerInterceptor } from '@kodexo/common/src/main/middlewares'
import { Inject } from '@kodexo/injection'
import { Crud } from '../../../../src/decorators'
import { CrudControllerInterface } from '../../../../src/interfaces/CrudControllerInterface'
import { CreateWorkshopDto } from './dto/create-workshop.dto'
import { UpdateWorkshopDto } from './dto/update-workshop.dto'
import { Workshop } from './entities/workshop.entity'
import { WorkshopModel } from './serializations/workshop.model'
import { WorkshopsService } from './workshops.service'

@Crud({
  model: Workshop,
  dto: {
    createDto: CreateWorkshopDto,
    updateDto: UpdateWorkshopDto
  },
  interceptors: {
    getOne: [SerializerInterceptor.forModel(WorkshopModel)],
    getMany: [SerializerInterceptor.forModel(WorkshopModel, true)]
  }
})
@Controller('/workshops')
export class WorkshopsController implements CrudControllerInterface<Workshop> {
  constructor(@Inject public service: WorkshopsService) {}
}
