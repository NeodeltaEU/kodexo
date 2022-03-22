import { Store } from '@kodexo/injection'
import { v4 as uuid } from 'uuid'
import { Request, Response } from '../..'

type callbackRequestFunction = {
  (needed: string, request: Request, response?: Response): any
}

export class ParamBuilder {
  static buildParamDecorator(callback: callbackRequestFunction) {
    return (needed?: string) => {
      return (target: any, propertyKey: string, paramaterIndex: number) => {
        const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

        paramaterStore.set('type', uuid())
        paramaterStore.set('callback', callback)

        if (needed) paramaterStore.set('paramName', needed)
      }
    }
  }

  static buildParamDecoratorMandatory(callback: callbackRequestFunction) {
    return (needed: string) => {
      return (target: any, propertyKey: string, paramaterIndex: number) => {
        const paramaterStore = Store.from(target, propertyKey, paramaterIndex)

        paramaterStore.set('type', uuid())
        paramaterStore.set('callback', callback)

        if (needed) paramaterStore.set('paramName', needed)
      }
    }
  }
}
