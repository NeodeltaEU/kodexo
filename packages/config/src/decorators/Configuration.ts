import { Store } from '@neatsio/injection'

export function Configuration(configuration: Partial<Neatsio.Configuration>) {
  return function (target: any) {
    Store.from(target).set('configuration', configuration)
  }
}
