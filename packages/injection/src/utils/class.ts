export function getClass(target: any): any {
  return target.prototype ? target : target.constructor
}
