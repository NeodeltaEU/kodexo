import { getClass } from '@kodexo/common'
import { Injector } from '@kodexo/injection'
import { Class } from 'type-fest'
import { AclService } from '../components/acl.service'
import { AccessResolver } from '../main/AccessResolver'
import { kebabCase } from '../utils/kebab-case'

export function AclForController(resolver: Class<AccessResolver>) {
  return (target: any) => {
    Injector.invoke(AclService).then(aclService => {
      const resource = kebabCase(getClass(target).name).slice(0, -11)

      aclService.registerAcl({
        resource,
        resolver
      })
    })
  }
}
