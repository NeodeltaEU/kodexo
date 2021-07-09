import { Controller, Get } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import e = require('express')
import { CarService } from './CarService'

@Controller('/cars')
export class CarsController {
  test = 2

  @Inject carService: CarService

  @Get('/')
  async getCars() {
    return this.carService.getCars()
  }
}
