import { Permission } from './Permission'
import { Role } from './Role'

type SortedPermissions = {
  wildcardPositive: boolean
  wildcardNegative: boolean
  regularPositive: boolean
  regularNegative: boolean
  positivePermission: Permission | undefined
}

export class PermissionChecker {
  private action: string
  private resource: string
  private contextArgs: any
  private permissions: Permission[] = []

  constructor(private role: Role) {}

  /**
   *
   * @param action
   * @returns
   */
  execute(action: string) {
    this.action = action
    return this
  }

  /**
   *
   */
  context(args: any) {
    this.contextArgs = args
    return this
  }

  /**
   *
   * @param resource
   * @returns
   */
  on(resource: string) {
    this.resource = resource
    const sortedPermissions = this.fetchPermissions()

    const granted = this.test(sortedPermissions)

    const attributes = sortedPermissions.positivePermission?.attributes || ['*']

    return { granted, attributes }
  }

  /**
   *
   */
  private fetchPermissions(): SortedPermissions {
    this.permissions = this.role.getPermissionsForResource(this.resource)

    const wildcardPositive = this.hasPositiveWildcardPermission()
    const wildcardNegative = this.hasNegativeWildcardPermission()
    const regularPositive = this.hasPositiveRegularPermission()
    const regularNegative = this.hasNegativeRegularPermission()

    const positivePermission = this.findRegularPositivePermission()

    return {
      wildcardPositive,
      wildcardNegative,
      regularPositive,
      regularNegative,
      positivePermission
    }
  }

  /**
   *
   * @returns
   */
  private test({
    wildcardPositive,
    wildcardNegative,
    regularPositive,
    regularNegative,
    positivePermission
  }: SortedPermissions): boolean {
    if (wildcardPositive) return !regularNegative

    if (wildcardNegative)
      return regularPositive ? positivePermission?.testCondition(this.contextArgs) || false : false

    return positivePermission?.testCondition(this.contextArgs) || false
  }

  /**
   *
   * @returns
   */
  private findRegularPositivePermission() {
    return this.permissions.find(
      permission =>
        permission.allowed &&
        permission.resource === this.resource &&
        permission.action === this.action
    )
  }

  /**
   *
   * @returns
   */
  private hasPositiveWildcardPermission(): boolean {
    return this.permissions.some(permission => permission.allowed && permission.action === '*')
  }

  /**
   *
   * @returns
   */
  private hasNegativeWildcardPermission(): boolean {
    return this.permissions.some(permission => !permission.allowed && permission.action === '*')
  }

  /**
   *
   */
  private hasPositiveRegularPermission(): boolean {
    return this.permissions.some(
      permission =>
        permission.allowed &&
        permission.resource === this.resource &&
        permission.action === this.action
    )
  }

  /**
   *
   * @returns
   */
  private hasNegativeRegularPermission(): boolean {
    return this.permissions.some(
      permission =>
        !permission.allowed &&
        permission.resource === this.resource &&
        permission.action === this.action
    )
  }
}
