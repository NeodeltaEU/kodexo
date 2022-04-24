import { Request } from '@tinyhttp/app'

export type RequestWithResult = Request & {
  result?: any
}
