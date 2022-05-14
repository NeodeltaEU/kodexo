import { ApiGroup, Summary } from '@kodexo/app'
import { Controller, Get, RouteParams } from '@kodexo/common'
import { Crud, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { CarsService } from './cars.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './entities/car.entity'
import { CarSerialized } from './serializations/car.serialized'

@Crud({
  model: Car,
  serialization: CarSerialized,
  dto: {
    createDto: CreateCarDto,
    updateDto: UpdateCarDto
  }
})
@ApiGroup('Cars')
@Controller('/cars')
export class CarsController implements CrudControllerInterface<Car> {
  constructor(@Inject public service: CarsService) {}

  @Summary('Get registration for a car')
  @Get('/:id/registration')
  async getRegistration(@RouteParams('id') id: string) {
    return this.service.getRegistration(id)
  }
}
