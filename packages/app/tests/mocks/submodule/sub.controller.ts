import { Controller, Get } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ApiGroup } from '../../../src/decorators/openapi/ApiGroup'
import { Summary } from '../../../src/decorators/openapi/Summary'
import { AsyncService } from './async.service'

@ApiGroup('Submodule')
@Controller('/')
export class SubController {
  constructor(@Inject private asyncService: AsyncService) {}

  @Summary('Sub route')
  @Get('/')
  async subRoute() {
    return { sub: true }
  }

  @Summary('Sub async route')
  @Get('/async')
  async asyncRoute() {
    return { async: this.asyncService.valueInitFromAsync }
  }
}
