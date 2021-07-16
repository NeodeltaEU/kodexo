import { Handler } from '@tinyhttp/app'

export interface MiddlewareHandling {
  use: Handler
}
