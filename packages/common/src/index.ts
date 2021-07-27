export * from './main'
export * from './decorators'
export * from './interfaces'
export * from './utils'

export { Response, NextFunction, URLParams } from '@tinyhttp/app'

import { Request as TinyHttpRequest } from '@tinyhttp/app'

interface Request extends TinyHttpRequest {
  filter?: any
}

export { Request }
