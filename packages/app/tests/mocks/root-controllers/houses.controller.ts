import { BodyParams, Controller, Get, Post, Use } from '@uminily/common'
import { Inject } from '../../../../injection/dist'
import { ControllerMiddleware } from '../controller.middleware'
import { AsyncService } from '../submodule/async.service'

@Use(ControllerMiddleware)
@Controller('/houses')
export class HousesController {
  constructor(@Inject private asyncService: AsyncService) {}

  @Post('/')
  async createHouse(@BodyParams('override') override: boolean) {
    return { override }
  }

  @Get('/async')
  async getAsync() {
    return { async: this.asyncService.valueInitFromAsync }
  }
}
