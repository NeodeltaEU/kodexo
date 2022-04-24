import { Transform } from 'class-transformer'

function reduceToObject(value: any) {
  return typeof value === 'string' ? { id: value } : value
}

export const TransformIDToModel = () => {
  return Transform(
    ({ value }) => {
      if (value === null || value === undefined) return value
      if (Array.isArray(value)) return value.map(reduceToObject)
      return reduceToObject(value)
    },
    { toClassOnly: true }
  )
}
