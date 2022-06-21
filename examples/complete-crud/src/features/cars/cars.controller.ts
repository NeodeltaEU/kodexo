import { Get, RouteParams, UseSerialization } from '@kodexo/common'
import { CrudController, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ApiGroup, ApiPathParam, Summary } from '@kodexo/openapi'
import { CarsService } from './cars.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './entities/car.entity'
import { CarSerialized } from './serializations/car.serialized'
import { RegistrationSerialized } from './serializations/registration.serialized'

@ApiGroup('Cars')
@CrudController('/cars', {
  model: Car,
  dto: {
    createDto: CreateCarDto,
    updateDto: UpdateCarDto
  },
  serialization: CarSerialized
})
export class CarsController implements CrudControllerInterface<Car> {
  constructor(@Inject public service: CarsService) {}

  @UseSerialization(RegistrationSerialized)
  @Summary('Get registration for a car')
  @Get('/:id/registration')
  async getRegistration(@RouteParams('id') @ApiPathParam('Id of the Car') id: string) {
    return this.service.getRegistration(id)
  }
}
