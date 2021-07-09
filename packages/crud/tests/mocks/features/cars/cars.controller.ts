import { BodyParams, Controller, Get, Post, RouteParams } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { Crud } from '../../../../src/decorators'
import { CrudControllerInterface } from '../../../../src/interfaces/CrudControllerInterface'
import { Car } from './entities/car.entity'
import { CarsService } from './cars.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

@Crud({
  model: Car,
  dto: {
    createDto: CreateCarDto,
    updateDto: UpdateCarDto
  }
})
@Controller('/cars')
export class CarsController implements CrudControllerInterface<Car> {
  constructor(@Inject public service: CarsService) {}
}
