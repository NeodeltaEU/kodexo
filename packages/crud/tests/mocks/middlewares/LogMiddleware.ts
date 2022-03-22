import { MiddlewareHandling, Request, Response, NextFunction, Middleware } from '@kodexo/common'

export const mockCall = (req: Request) => {
  req.params.log = 'yes'
}

@Middleware()
export class LogMiddleware implements MiddlewareHandling {
  async use(req: Request, res: Response, next: NextFunction) {
    mockCall(req)

    next()
  }
}
