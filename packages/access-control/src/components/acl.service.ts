import { AppProvidersService } from '@kodexo/app'
import { Request, Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { Class } from 'type-fest'
import { UserRole } from '../interfaces/UserRole'
import { AccessResolver, OrmFilterParams } from '../main/AccessResolver'

export interface Acl {
  resource: string
  resolver: Class<AccessResolver>
}

@Service()
export class AclService {
  constructor(@Inject private providersService: AppProvidersService) {}

  private registeredAcls: Array<Acl> = []

  /**
   *
   * @param role
   * @param resource
   * @param action
   * @returns
   */
  findAcl(resource: string): Acl | undefined {
    return this.registeredAcls.find(acl => acl.resource === resource)
  }

  /**
   *
   * @param acl
   * @returns
   */
  registerAcl(acl: Acl) {
    if (this.findAcl(acl.resource)) return

    this.registeredAcls.push(acl)
  }

  /**
   *
   * @param role
   * @param resource
   * @param action
   * @returns
   */
  async checkAccess(
    user: UserRole,
    resource: string,
    action: string,
    req: Request
  ): Promise<boolean> {
    const acl = this.findAcl(resource)

    if (!acl) return true

    const resolver = this.providersService.getInstanceProvider(acl.resolver) as
      | AccessResolver
      | undefined

    if (!resolver) throw new Error(`Resolver ${acl.resolver.name} not found`)

    return resolver.canAccess(user, { resource, action, req })
  }

  /**
   *
   * @param user
   * @param resource
   * @param action
   * @param req
   */
  async prepareQueryFilter(
    user: UserRole,
    resource: string,
    action: string,
    req: Request
  ): Promise<OrmFilterParams> {
    const acl = this.findAcl(resource)
    if (!acl) return {}

    const resolver = this.providersService.getInstanceProvider(acl.resolver) as
      | AccessResolver
      | undefined

    if (!resolver) throw new Error(`Resolver ${acl.resolver.name} not found`)

    return resolver.prepareQueryFilter
      ? resolver.prepareQueryFilter(user, { resource, action, req })
      : {}
  }

  /**
   *
   * @param user
   * @param resource
   * @param action
   * @param req
   */
  async prepareBodyMerge(
    user: UserRole,
    resource: string,
    action: string,
    req: Request
  ): Promise<any> {
    const acl = this.findAcl(resource)

    if (!acl) return {}

    const resolver = this.providersService.getInstanceProvider(acl.resolver) as
      | AccessResolver
      | undefined

    if (!resolver) throw new Error(`Resolver ${acl.resolver.name} not found`)

    return resolver.prepareBodyMerge
      ? resolver.prepareBodyMerge(user, { resource, action, req })
      : {}
  }
}
