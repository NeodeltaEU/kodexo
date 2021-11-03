import { AccessControlCenter } from '../src/main/AccessControlCenter'

/**
 *
 */
describe('- Access Control Center: Global', () => {
  let acc: AccessControlCenter

  beforeAll(() => {
    acc = new AccessControlCenter()

    acc
      .defineRole('Consumer')
      .allow('read', 'Car')
      .allow('write', 'Car', ['*'], {
        fn: 'EQUALS',
        args: {
          ConsumerId: 'ownerId'
        }
      })
      .allow('read', 'User', ['!manager'])

    acc.defineRole('Manager').allowAll('Car').deny('delete', 'Car')

    acc.defineRole('Lead').denyAll('Car').allow('read', 'Car', ['name', 'brand'])
  })

  it('should register a first role', () => {
    expect(acc.getRoles()).toContain('Consumer')
  })

  /**
   *
   */
  describe('Consumer tests', () => {
    it('should consumer can read a car', () => {
      expect(acc.can('Consumer').execute('read').on('Car').granted).toBeTruthy()
    })

    it('should consumer can not delete a car', () => {
      expect(acc.can('Consumer').execute('delete').on('Car').granted).toBeFalsy()
    })

    it('should consumer can write on his car', () => {
      expect(
        acc.can('Consumer').execute('write').context({ ConsumerId: 1, ownerId: 1 }).on('Car')
          .granted
      ).toBeTruthy()
    })

    it("should consumer can not write on other's Car", () => {
      expect(
        acc
          .can('Consumer')
          .execute('write')
          .context({ ConsumerId: 1, ownerId: 2, myCar: 4 })
          .on('Car').granted
      ).toBeFalsy()
    })
  })

  /**
   *
   */
  describe('Manager tests', () => {
    it('should manager can read with wildcard', () => {
      expect(acc.can('Manager').execute('read').on('Car').granted).toBeTruthy()
    })

    it('should manager can not delete a Car', () => {
      expect(acc.can('Manager').execute('delete').on('Car').granted).toBeFalsy()
    })
  })

  /**
   *
   */
  describe('Lead tests', () => {
    it('should lead can not write on car', () => {
      expect(acc.can('Lead').execute('write').on('Car').granted).toBeFalsy()
    })

    it('should lead can not delete a car', () => {
      expect(acc.can('Lead').execute('delete').on('Car').granted).toBeFalsy()
    })

    it('should lead can read a dar', () => {
      expect(acc.can('Lead').execute('read').on('Car').granted).toBeTruthy()
    })
  })

  describe('Attributes driven tests', () => {
    it('should return all attributes', () => {
      expect(acc.can('Consumer').execute('read').on('Car').attributes).toEqual(['*'])
    })

    it('should return inverse attribute on user read', () => {
      expect(acc.can('Consumer').execute('read').on('User').attributes).toEqual(['!manager'])
    })

    it('should return only some attributes on reading car after denyAll with allow for only read', () => {
      expect(acc.can('Lead').execute('read').on('Car').attributes).toEqual(['name', 'brand'])
    })
  })
})

/**
 *
 */
describe('- Access Control Center: Define roles', () => {
  it('should throw an error when define a role with denyAll then allowAll', () => {
    const acc = new AccessControlCenter()

    expect(() => {
      acc.defineRole('Admin').denyAll('Car').allowAll('Car')
    }).toThrowError()
  })

  /**
   *
   */
  describe('Extends roles', () => {
    let acc: AccessControlCenter

    beforeAll(() => {
      acc = new AccessControlCenter()

      acc
        .defineRole('User')
        .allow('read', 'Car')
        .allow('write', 'Car', ['*'], {
          fn: 'EQUALS',
          args: {
            userId: 'ownerId'
          }
        })
        .allow('read', 'User', ['*'], {
          fn: 'EQUALS',
          args: {
            userId: 'id'
          }
        })

      acc.extendRole('User', 'LimitedUser').deny('write', 'Car').deny('read', 'User')

      acc.extendRole('LimitedUser', 'OnlyRestrictedUser').allow('read', 'User')
    })

    it('should register roles', () => {
      expect(acc.getRoles()).toContain('User')
      expect(acc.getRoles()).toContain('LimitedUser')
      expect(acc.getRoles()).toContain('OnlyRestrictedUser')
    })

    it('should user can read a car', () => {
      expect(acc.can('User').execute('read').on('Car').granted).toBeTruthy()
    })

    it('should user can write on car', () => {
      expect(
        acc.can('User').execute('write').context({ userId: 1, ownerId: 1 }).on('Car').granted
      ).toBeTruthy()
    })

    it('should user can read their user informations', () => {
      expect(
        acc.can('User').execute('read').context({ userId: 1, id: 1 }).on('User').granted
      ).toBeTruthy()
    })

    it('should user can not read other user information', () => {
      expect(
        acc.can('User').execute('read').context({ userId: 1, id: 2 }).on('User').granted
      ).toBeFalsy()
    })

    it('should limited user can read a car', () => {
      expect(acc.can('LimitedUser').execute('read').on('Car').granted).toBeTruthy()
    })

    it('should limited user can not write on car', () => {
      expect(
        acc.can('LimitedUser').execute('write').context({ userId: 1, ownerId: 1 }).on('Car').granted
      ).toBeFalsy()
    })

    it('should limited user can not read any user', () => {
      expect(
        acc.can('LimitedUser').execute('read').context({ userId: 1, ownerId: 1 }).on('User').granted
      ).toBeFalsy()
    })

    it('should only restricted user can read any user', () => {
      expect(acc.can('OnlyRestrictedUser').execute('read').on('User').granted).toBeTruthy()
    })

    it('should only restricted user can not write on car', () => {
      expect(
        acc.can('OnlyRestrictedUser').execute('write').context({ userId: 1, ownerId: 1 }).on('Car')
          .granted
      ).toBeFalsy()
    })
  })
})
