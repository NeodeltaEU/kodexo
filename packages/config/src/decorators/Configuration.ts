import { Store } from '@uminily/injection'

export function Configuration(configuration: Partial<Kodexo.Configuration>) {
  return function (target: any) {
    Store.from(target).set('configuration', configuration)
  }
}
