import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'

export function ApiModel(options: ApiModelOptions) {
  return (target: Class<any>) => {
    Store.from(target).set('openapi:model', options)
  }
}

export type ApiModelOptions = {
  title: string
  description?: string
}
