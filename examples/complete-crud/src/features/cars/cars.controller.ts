import { Controller, Get, RouteParams, UseSerialization } from '@kodexo/common'
import { Crud, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ApiGroup, Summary } from '@kodexo/openapi'
import { CarsService } from './cars.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './entities/car.entity'
import { CarSerialized } from './serializations/car.serialized'
import { RegistrationSerialized } from './serializations/registration.serialized'

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

  @UseSerialization(RegistrationSerialized)
  @Summary('Get registration for a car')
  @Get('/:id/registration')
  async getRegistration(@RouteParams('id') id: string) {
    return this.service.getRegistration(id)
  }
}
