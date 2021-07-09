import { Class } from 'type-fest'

/**
 *
 * @param options
 */
export function Collection(target: Function): void
export function Collection(options: any): Function
export function Collection(arg: any): void | Function {
  if (typeof arg === 'function') {
    // if no options passed
  }
}
