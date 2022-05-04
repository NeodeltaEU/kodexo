import { Store } from '@kodexo/injection'

export function ApiGroup(name: string) {
  return (target: any) => {
    Store.from(target).set('openapi:group', name)
  }
}
