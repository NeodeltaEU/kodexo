import { Class } from 'type-fest'
import { CrudRouteFactory } from '../CrudRoutesFactory'

/**
 *
 * @param options
 */
export function Crud<M, C, U>(options: CrudOptionsType<M, C, U>): ClassDecorator {
  const parsedOptions = parseCrudOptions(options)

  return (target: any) => {
    CrudRouteFactory.create<M, C, U>(target, parsedOptions)
  }
}

function parseCrudOptions<M, C, U>(options: CrudOptionsType<M, C, U>): any {
  return options
}

export type CrudOptionsType<M, C, U> = {
  model: Class<M>
  dto: {
    createDto: Class<C>
    updateDto: Class<U>
  }
}
