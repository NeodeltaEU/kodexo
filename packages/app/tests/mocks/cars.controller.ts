import { Controller, Get, Post, Use } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { AuthMiddleware } from './auth.middleware'
import { CarService } from './CarService'
import { LogMiddleware } from './log.middleware'

@Controller('/cars')
export class CarsController {
  test = 2

  constructor(@Inject private carService: CarService) {}

  @Get('/')
  async getCars() {
    return this.carService.getCars()
  }

  @Use(LogMiddleware)
  @Use(AuthMiddleware)
  @Post('/secured')
  async secured() {
    return this.carService.getCar()
  }
}
