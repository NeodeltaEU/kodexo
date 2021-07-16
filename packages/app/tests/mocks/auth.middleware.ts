import { Middleware, MiddlewareHandling, NextFunction, Request, Response } from '@uminily/common'
import { Inject } from '../../../injection/dist'
import { CityService } from './CityService'

@Middleware()
export class AuthMiddleware implements MiddlewareHandling {
  constructor(@Inject private cityService: CityService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)

    console.log(this.cityService)

    next()
  }
}
