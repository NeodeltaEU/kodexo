import { Condition } from '../interfaces/Condition'
import { removeItemfromArrayAt } from '../utils'
import { Permission } from './Permission'
import { PermissionChecker } from './PermissionChecker'

export class Role {
  constructor(
    public readonly name: string,
    private permissions: Permission[] = [],
    private resourcesGlobalRules: string[] = []
  ) {}

  /**
   *
   */
  clone() {
    return new Role(this.name, [...this.permissions], [...this.resourcesGlobalRules])
  }

  /**
   *
   * @param action
   * @param resource
   */
  allow(action: string, resource: string, attributes: string[] = ['*'], condition?: Condition) {
    if (action === '*') {
      throw new Error('Cannot allow all actions from allow method, use allowAll')
    }

    this.cleanAlreadyExistsPermission(action, resource)

    const permission = new Permission(action, resource, true, attributes, condition)
    this.permissions.push(permission)

    return this
  }

  /**
   *
   * @param action
   * @param resource
   */
  deny(action: string, resource: string) {
    if (action === '*') {
      throw new Error('Cannot deny all actions from deny method, use denyAll')
    }

    this.cleanAlreadyExistsPermission(action, resource)

    const permission = new Permission(action, resource, false)
    this.permissions.push(permission)

    return this
  }

  /**
   *
   * @param resource
   * @returns
   */
  allowAll(resource: string) {
    if (this.resourcesGlobalRules.includes(resource)) {
      throw new Error(`Global rules already set on ${resource}`)
    }

    this.permissions.push(new Permission('*', resource, true))

    this.resourcesGlobalRules.push(resource)

    return this
  }

  /**
   *
   * @param resource
   */
  denyAll(resource: string) {
    if (this.resourcesGlobalRules.includes(resource)) {
      throw new Error(`Global rules already set on ${resource}`)
    }

    this.permissions.push(new Permission('*', resource, false))

    this.resourcesGlobalRules.push(resource)

    return this
  }

  /**
   *
   */
  can() {
    const checker = new PermissionChecker(this)
    return checker
  }

  /**
   *
   * @param resource
   * @returns
   */
  getPermissionsForResource(resource: string) {
    return this.permissions.filter(permission => permission.resource === resource)
  }

  /**
   *
   * @param resource
   * @param action
   */
  getPermission(resource: string, action: string) {
    return this.permissions.find(
      permission => permission.resource === resource && permission.action === action
    )
  }

  /**
   *
   * @param action
   * @param resource
   */
  private cleanAlreadyExistsPermission(action: string, resource: string) {
    const alreadyExistingPermissionIndex = this.permissions.findIndex(
      permission => permission.resource === resource && permission.action === action
    )

    this.permissions = removeItemfromArrayAt(this.permissions, alreadyExistingPermissionIndex)
  }
}
