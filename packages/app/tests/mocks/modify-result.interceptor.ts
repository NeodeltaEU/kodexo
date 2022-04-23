import { MiddlewareHandling, NextFunction, Response, Interceptor } from '@kodexo/common'
import { RequestWithResult } from '../../src'

@Interceptor()
export class ModifyResultInterceptor implements MiddlewareHandling {
  async use(req: RequestWithResult, res: Response<any>, next: NextFunction) {
    next()
  }
}
