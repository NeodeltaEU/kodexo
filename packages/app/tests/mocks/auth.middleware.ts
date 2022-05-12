import { Middleware, MiddlewareHandling, NextFunction, Request, Response } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { CityService } from './CityService'

@Middleware()
export class AuthMiddleware implements MiddlewareHandling {
  constructor(@Inject private cityService: CityService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //console.log(req.body)
    next()
  }
}
