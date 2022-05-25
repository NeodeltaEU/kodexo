import { Dictionary, Filter } from '@mikro-orm/core'

export type AccessFilterOptions<T> = {
  mainKey?: keyof T
}

export const AccessTenancyFilter = <T>(options: AccessFilterOptions<T> = {}): ClassDecorator => {
  const { mainKey = 'id' } = options

  return Filter({
    name: 'AccessTenancyFilter',
    cond: (args: Dictionary = {}) => {
      const { ids, skip = false, overrideMainKey = null } = args

      // FIXME: CARE ABOUT THIS, CAN RETURN ALL THINGS
      if (!ids || skip) return {}

      const selectedKey = overrideMainKey || mainKey

      return {
        [selectedKey]: {
          $in: ids
        }
      }
    },
    args: false,
    default: true
  })
}
