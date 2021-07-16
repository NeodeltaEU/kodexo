import { MiddlewareHandling, Request, Response, NextFunction, Middleware } from '@uminily/common'

export const mockCall = (req: Request) => {
  req.params.log = 'yes'
}

@Middleware()
export class LogMiddleware implements MiddlewareHandling {
  use(req: Request, res: Response, next: NextFunction) {
    mockCall(req)

    next()
  }
}
