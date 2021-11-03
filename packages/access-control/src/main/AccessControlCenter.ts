import { Role } from './Role'

export class AccessControlCenter {
  private registeredRoles: Map<string, Role> = new Map()

  constructor() {}

  /**
   *
   * @param roleName
   */
  defineRole(roleName: string) {
    if (this.registeredRoles.has(roleName)) {
      throw new Error(`Role ${roleName} already defined`)
    }

    const role = new Role(roleName)

    this.registeredRoles.set(roleName, role)

    return role
  }

  /**
   *
   * @param roleName
   * @param newRoleName
   */
  extendRole(roleName: string, newRoleName: string) {
    if (this.registeredRoles.has(newRoleName)) {
      throw new Error(`Role ${newRoleName} already defined`)
    }

    const role = this.registeredRoles.get(roleName)

    if (!role) {
      throw new Error(`Role ${roleName} not defined`)
    }

    const newRole = role.clone()

    this.registeredRoles.set(newRoleName, newRole)

    return newRole
  }

  /**
   *
   */
  getRoles() {
    return Array.from(this.registeredRoles.keys())
  }

  /**
   *
   * @param roleName
   * @returns
   */
  getRole(roleName: string) {
    const role = this.registeredRoles.get(roleName)

    if (!role) {
      throw new Error(`Role ${roleName} not defined`)
    }

    return role
  }

  /**
   *
   * @param roleName
   */
  can(roleName: string) {
    const role = this.registeredRoles.get(roleName)

    if (!role) {
      throw new Error(`Role ${roleName} not defined`)
    }

    return role.can()
  }
}
