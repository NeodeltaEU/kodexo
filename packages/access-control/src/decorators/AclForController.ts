import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { AccessResolver } from '../main/AccessResolver'

export function AclForController(resolver: Class<AccessResolver>) {
  return (target: any) => {
    Store.from(target).set('acl:resolver', resolver)
    /*Injector.invoke(AclService).then(aclService => {
      const resource = kebabCase(getClass(target).name).slice(0, -11)

      aclService.registerAcl({
        resource,
        resolver
      })
    })*/
  }
}
