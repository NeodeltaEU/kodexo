import { getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'

export function ApiProperty(options: ApiPropertyOptions = {}) {
  const { type, description, required, example } = options

  return (target: any, propertyKey: string | symbol) => {
    const store = Store.from(getClass(target))

    if (!store.has('properties')) store.set('properties', {})

    const properties = store.get('properties')

    const resumedType = Reflect.getMetadata('design:type', target, propertyKey)

    properties[propertyKey] = {
      type: type || resumedType,
      description,
      required: required ?? undefined,
      example
    }
  }
}

export type ApiPropertyOptions = {
  type?: Function | string
  description?: string
  required?: boolean
  example?: any
}
