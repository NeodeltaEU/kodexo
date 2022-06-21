import { Controller } from '@kodexo/common'
import { Class } from 'type-fest'
import { Crud, CrudOptionsType } from './Crud'

export function CrudController(route: string, options: CrudOptionsType) {
  return (target: Class<any>) => {
    Controller(route)(target)
    Crud(options)(target)
  }
}
