export function isObject(obj: any): boolean {
  const type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}
