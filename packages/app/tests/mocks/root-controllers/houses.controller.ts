import { BodyParams, Controller, Get, Post, RouteParams, Use } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ApiGroup, Summary } from '@kodexo/openapi'
import { ControllerMiddleware } from '../controller.middleware'
import { AsyncService } from '../submodule/async.service'

@ApiGroup('Houses')
@Use(ControllerMiddleware)
@Controller('/houses')
export class HousesController {
  constructor(@Inject private asyncService: AsyncService) {}

  @Summary('Create house')
  @Post('/')
  async createHouse(@BodyParams('override') override: boolean) {
    return { override }
  }

  @Summary('Async service')
  @Get('/async')
  async getAsync() {
    return { async: this.asyncService.valueInitFromAsync }
  }

  @Summary('With Params')
  @Get('/with-params/:id')
  async withParams(@RouteParams('id') id: string) {
    return { id }
  }
}
