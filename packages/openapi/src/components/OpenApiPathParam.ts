import { OpenAPIV3_1 } from 'openapi-types'

export class OpenApiPathParam {
  /**
   *
   * @param target
   * @param propertyKey
   */
  static save(target: any, propertyKey: string, paramaterIndex: number) {}
}

export type PathParam = {
  name: string
  schema: OpenAPIV3_1.SchemaObject
  description: string
  required?: boolean
}
