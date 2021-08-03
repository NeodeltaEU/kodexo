import { Middleware, MiddlewareHandling, NextFunction, Request, Response } from '@uminily/common'
import { Inject } from '../../../injection/dist'
import { CityService } from './CityService'

@Middleware()
export class LogMiddleware implements MiddlewareHandling {
  use(req: Request, res: Response, next: NextFunction) {
    //console.log('wesh')
    next()
  }
}
