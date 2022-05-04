import { Endpoint, getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import { OpenAPIV3_1 } from 'openapi-types'
import { cleanObject } from '../utils/cleanObject'

type DtoProperty = {
  type: Function | string
  description: string
}

export class OpenApiPathItem {
  public readonly method: OpenAPIV3_1.HttpMethods

  private responseProperties: Record<string, any> = {}
  private summary: string = 'A route'
  private apiGroup?: string

  constructor(private metadata: Endpoint) {
    const method = metadata.method as unknown
    this.method = method as OpenAPIV3_1.HttpMethods

    this.extractResultSchema()
    this.extractSummary()
    this.extractApiGroup()
  }

  /**
   *
   */
  private extractApiGroup() {
    this.apiGroup = Store.from(getClass(this.metadata.target)).get('openapi:group')
  }

  /**
   *
   */
  private extractResultSchema() {
    if (!this.metadata.store.has('resultSchema')) return

    const dtoStore = Store.from(this.metadata.store.get('resultSchema'))

    this.responseProperties = this.extractProperties(dtoStore)
  }

  /**
   *
   * @returns
   */
  private extractSummary() {
    if (!this.metadata.store.has('summary')) return
    this.summary = this.metadata.store.get('summary')
  }

  /**
   *
   */
  private extractProperties(dtoStore: Store) {
    if (!dtoStore.has('properties')) return {}

    const properties = dtoStore.get<DtoProperty[]>('properties')

    return Object.entries(properties).reduce((result, [key, value]) => {
      const { type, description } = value

      const properties = this.getSubProperties(type)

      const formattedType = this.convertTypeToOpenApiTypes(type)

      result[key] = cleanObject({
        description,
        type: formattedType.type,
        format: formattedType.format,
        properties
      })

      return result
    }, {} as Record<string, any>)
  }

  private getSubProperties(propertyType: Function | string) {
    if (!this.isClass(propertyType)) return undefined

    const store = Store.from(getClass(propertyType))
    return this.extractProperties(store)
  }

  /**
   *
   * @param propertyType
   */
  private convertTypeToOpenApiTypes(propertyType: Function | string) {
    if (typeof propertyType === 'string') {
      return propertyType.toLowerCase() === 'integer'
        ? { type: 'integer' }
        : { type: 'string', format: propertyType }
    }

    switch (propertyType.name) {
      case 'String':
        return { type: 'string' }

      case 'Number':
        return { type: 'number' }

      case 'Boolean':
        return { type: 'boolean' }

      case 'Date':
        return { type: 'string', format: 'date-time' }
    }

    return { type: this.isClass(propertyType) ? 'object' : 'string' }
  }

  private isPrimitive(type: any) {
    return type?.name === 'String' || type?.name === 'Number' || type?.name === 'Boolean'
  }

  private isObject(type: any) {
    return type?.name === 'Date' || type?.name === 'Object'
  }

  private isClass(type: any) {
    if (typeof type !== 'function') return false

    return !(this.isPrimitive(type) || this.isObject(type))
  }

  /**
   *
   * @returns
   */
  toObject(): OpenAPIV3_1.OperationObject {
    const tags = this.apiGroup ? [this.apiGroup] : []

    return {
      tags,
      summary: this.summary,
      /*requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },*/
      responses: {
        [this.metadata.statusCode]: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: this.responseProperties
              }
            }
          }
        }
      }
    }
  }
}
