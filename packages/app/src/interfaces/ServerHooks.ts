import { Class } from 'type-fest'

export interface ServerHooks {
  [key: string]: any

  afterInit?: () => Promise<void>
}
