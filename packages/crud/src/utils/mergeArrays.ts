export function mergeArrays<T = any>(arr1: Array<T> = [], arr2: Array<T> = []) {
  return [...new Set([...arr1, ...arr2])]
}
