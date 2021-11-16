import { BodyParams, Controller, Get, Post, RouteParams } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { Crud } from '../../../../src/decorators'
import { CrudControllerInterface } from '../../../../src/interfaces/CrudControllerInterface'
import { Car } from './entities/car.entity'
import { CarsService } from './cars.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Allow } from '../../decorators/Allow'

@Crud({
  model: Car,
  dto: {
    createDto: CreateCarDto,
    updateDto: UpdateCarDto
  },
  decorators: {
    getOne: [Allow('admin')]
  }
})
@Controller('/cars')
export class CarsController implements CrudControllerInterface<Car> {
  constructor(@Inject public service: CarsService) {}
}
