import { getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'

export function ApiProperty(options: ApiPropertyOptions = {}) {
  const { type, description, required, example, items, nullable } = options

  return (target: any, propertyKey: string | symbol) => {
    const store = Store.from(getClass(target))

    if (!store.has('openapi:properties')) store.set('openapi:properties', {})

    const properties = store.get('openapi:properties')

    const resumedType = Reflect.getMetadata('design:type', target, propertyKey)

    properties[propertyKey] = {
      type: type || resumedType,
      description,
      items,
      required: required ?? undefined,
      example,
      nullable: nullable ?? undefined
    }
  }
}

export type ApiPropertyOptions = {
  type?: Function | string
  description?: string
  items?: Array<Function | Class<any> | string>
  required?: boolean
  example?: any
  nullable?: boolean
}
