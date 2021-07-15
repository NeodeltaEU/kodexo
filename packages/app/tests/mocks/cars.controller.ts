import { Controller, Get } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { CarService } from './CarService'

@Controller('/cars')
export class CarsController {
  test = 2

  constructor(@Inject private carService: CarService) {}

  @Get('/')
  async getCars() {
    return this.carService.getCars()
  }
}
