import { Controller, Get } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
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
