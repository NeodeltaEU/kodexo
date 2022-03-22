import { Controller, Get } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
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
