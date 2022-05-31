import { Transform } from 'class-transformer'

export const TransformToAssociation = () => {
  return Transform(
    ({ value }) => {
      if (Array.isArray(value)) {
        return value.map((entry: any) => {
          return entry?.id ? entry.id : entry
        })
      }

      return value?.id ? value.id : value
    },
    { toClassOnly: true }
  )
}
