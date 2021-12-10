import { Request, Response, NextFunction } from '@tinyhttp/app'

export interface MiddlewareHandling {
  use: (req: Request, res: Response, next: NextFunction, args?: any) => Promise<void>
}
