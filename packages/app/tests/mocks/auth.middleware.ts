import { Middleware, MiddlewareHandling, NextFunction, Response } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { CityService } from './CityService'

@Middleware()
export class AuthMiddleware implements MiddlewareHandling {
  constructor(@Inject private cityService: CityService) {}

  async use(req: any, res: Response, next: NextFunction) {
    //console.log(req.body)

    const group = req.query.admin ? 'admin' : 'user'

    req.groups = [group]

    next()
  }
}
