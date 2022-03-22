import { RequestContext } from '@mikro-orm/core'
import { providerRegistry } from '@kodexo/injection'
import { Handler, NextFunction, Request, Response } from '@tinyhttp/app'
import { ConnectionDatabase } from '.'

export function RequestContextMiddleware(): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    const connection = providerRegistry.resolve<ConnectionDatabase>(ConnectionDatabase).instance
    RequestContext.create(connection.orm.em, next)
  }
}
