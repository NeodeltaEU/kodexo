import { isObject } from '@kodexo/common'
import { Evaluate } from './Evaluate'

export class EqualsCondition implements Evaluate {
  evaluate(args?: any, context?: any): boolean {
    if (!args) {
      return true
    }

    if (!context) {
      return false
    }

    if (!isObject(args)) {
      throw new Error('EqualsCondition expects type of args to be object')
    }

    return Object.keys(args).every(key => {
      if (!context.hasOwnProperty(args[key]) || !context.hasOwnProperty(key)) return false

      return context[args[key]] === context[key]
    })
  }
}
