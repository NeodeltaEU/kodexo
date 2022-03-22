import { Store } from '@kodexo/injection'
import { PartialDeep } from 'type-fest'

export function Configuration(configuration: PartialDeep<Kodexo.Configuration>) {
  return function (target: any) {
    Store.from(target).set('configuration', configuration)
  }
}
