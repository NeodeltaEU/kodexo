import { Class } from 'type-fest'

export interface ServerHooks {
  afterInit?: () => Promise<void>
}
