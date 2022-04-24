import {
  MiddlewareHandling,
  NextFunction,
  Response,
  Interceptor,
  RequestWithResult
} from '@kodexo/common'

@Interceptor()
export class ModifyResultInterceptor implements MiddlewareHandling {
  async use(req: RequestWithResult, res: Response<any>, next: NextFunction) {
    next()
  }
}
