import {
  BodyParams,
  Controller,
  CookieParams,
  Get,
  Post,
  Res,
  Response,
  RouteParams,
  Use,
  UseSerialization,
  UseValidation
} from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ApiGroup, Summary } from '@kodexo/openapi'
import { AuthMiddleware } from '../auth.middleware'
import { CarDto } from '../car.dto'
import { CarService } from '../CarService'
import { LogMiddleware } from '../log.middleware'
import { CarModel } from './serialization/car'

@ApiGroup('Cars')
@Controller('/cars')
export class CarsController {
  test = 2

  constructor(@Inject private carService: CarService) {}

  @Summary('Get cars')
  @UseSerialization(CarModel)
  @Get('/')
  async getCars() {
    return this.carService.getCars()
  }

  @Summary('Secured route')
  @Use(LogMiddleware)
  @Use(AuthMiddleware)
  @Post('/secured')
  async secured() {
    return this.carService.getCar()
  }

  @Summary('Add new car')
  @UseValidation(CarDto)
  @UseSerialization(CarDto)
  @Post('/newcar')
  async newCar(@BodyParams() body: CarDto) {
    return body
  }

  @Summary('Add cookie route')
  @Post('/res')
  async getRes(
    @BodyParams('email') email: string,
    @BodyParams('password') password: string,
    @RouteParams('id') id: string,
    @Res() res: Response
  ) {
    const cookieOptions = {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      signed: true
    }

    res.cookie('thecookie', 'thevalue', cookieOptions)
    return { cookie: true, email }
  }

  @Summary('Get cookie')
  @Get('/cookies')
  async getCookies(@CookieParams('thecookie') cookie: string) {
    return { cookie }
  }
}
