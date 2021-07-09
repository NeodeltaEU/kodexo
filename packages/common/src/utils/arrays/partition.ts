import { isFunction } from '../functions'

export function partition<T>(arr: Array<T>, criteria: (item: T) => boolean): Array<Array<T>> {
  return [
    arr.filter(function (item) {
      return criteria(item)
    }),
    arr.filter(function (item) {
      return !criteria(item)
    })
  ]
}
