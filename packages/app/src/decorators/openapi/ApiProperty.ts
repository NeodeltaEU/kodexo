import { getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'

export function ApiProperty(options: ApiPropertyOptions = {}) {
  const { type, description } = options

  return (target: any, propertyKey: string | symbol) => {
    const store = Store.from(getClass(target))

    if (!store.has('properties')) store.set('properties', {})

    const properties = store.get('properties')

    const resumedType = Reflect.getMetadata('design:type', target, propertyKey)

    properties[propertyKey] = {
      type: type || resumedType,
      description
    }
  }
}

export type ApiPropertyOptions = {
  type?: Function | string
  description?: string
}
