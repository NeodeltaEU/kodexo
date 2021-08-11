import { Controller, Get } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { AsyncService } from './async.service'

@Controller('/')
export class SubController {
  constructor(@Inject private asyncService: AsyncService) {}

  @Get('/')
  async subRoute() {
    return { sub: true }
  }

  @Get('/async')
  async asyncRoute() {
    return { async: this.asyncService.valueInitFromAsync }
  }
}
