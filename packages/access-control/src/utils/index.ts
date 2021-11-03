export default function isObject(obj: any): boolean {
  var type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}

export function removeItemfromArrayAt<T>(arr: Array<T>, index: number): Array<T> {
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}
