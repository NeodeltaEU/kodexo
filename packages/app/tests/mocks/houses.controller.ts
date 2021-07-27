import { BodyParams, Controller, Post, Use } from '@uminily/common'
import { ControllerMiddleware } from './controller.middleware'

@Use(ControllerMiddleware)
@Controller('/houses')
export class HousesController {
  @Post('/')
  async createHouse(@BodyParams('override') override: boolean) {
    return { override }
  }
}
