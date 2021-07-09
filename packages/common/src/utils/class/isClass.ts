export function isClass(target: any) {
  if (!target) return false

  return target === target.prototype.constructor
}
