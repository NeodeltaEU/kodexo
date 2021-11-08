import { Middleware, MiddlewareHandling, NextFunction, Request, Response } from '@uminily/common'
import { Inject } from '../../../injection/dist'
import { CityService } from './CityService'

@Middleware()
export class ControllerMiddleware implements MiddlewareHandling {
  async use(req: Request, res: Response, next: NextFunction) {
    req.body = {
      override: true
    }
    next()
  }
}
