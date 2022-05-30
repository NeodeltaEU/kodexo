import { Request } from '@kodexo/common'
import { AccessControlService } from '../components'
import { UserRole } from '../interfaces/UserRole'

export type Rights = {
  [key: string]: Right[]
}

export type Right = {
  action: string
  allow: boolean
}

export abstract class AccessResolver {
  constructor(
    protected readonly acc: AccessControlService,
    protected readonly resource: string,
    protected rights: Rights
  ) {
    this.defineRoles()
  }

  protected async canAccessWithCustomContext(
    user: UserRole,
    context: AccessResolverContext
  ): Promise<boolean> {
    return true
  }

  /**
   *
   * @param user
   * @param context
   */
  public async canAccess(
    user: UserRole,
    { action, resource, req }: AccessResolverContext
  ): Promise<boolean> {
    const { granted } = this.acc.can(user.role).execute(action).on(resource)

    if (!granted) return false

    return this.canAccessWithCustomContext(user, { action, resource, req })
  }

  /**
   *
   */
  private defineRoles() {
    for (const [role, rights] of Object.entries(this.rights)) {
      const currentRole = this.acc.defineOrGetRole(role)

      for (const { action, allow } of rights) {
        if (allow) {
          if (action === '*') currentRole.allowAll(this.resource)
          else currentRole.allow(action, this.resource)
        } else {
          if (action === '*') currentRole.denyAll(this.resource)
          else currentRole.deny(action, this.resource)
        }
      }
    }
  }

  /**
   *
   * @param user
   * @param context
   */
  public async prepareQueryFilter(
    user: UserRole,
    context: AccessResolverContext
  ): Promise<OrmFilterParams> {
    return {}
  }

  /**
   *
   * @param user
   * @param context
   */
  public async prepareBodyMerge(user: UserRole, context: AccessResolverContext): Promise<any> {
    return {}
  }
}

export type AccessResolverContext = {
  req: Request
  resource: string
  action: string
}

export interface OrmFilterParams {
  [key: string]: any
}
