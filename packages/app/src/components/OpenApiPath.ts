import { Endpoint, getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import type { OpenAPIV3_1 } from 'openapi-types'
import { cleanObject } from '../utils/cleanObject'

type DtoProperty = {
  type: Function | string
  description: string
  example?: any
  required?: boolean
}

export class OpenApiPathItem {
  public readonly method: OpenAPIV3_1.HttpMethods

  private responseProperties: Record<string, any> = {}
  private bodyProperties?: Record<string, any>
  private requiredBodyProperties: Array<string> = []
  private summary: string = 'A route'
  private apiGroup?: string

  constructor(private metadata: Endpoint) {
    const method = metadata.method as unknown
    this.method = method as OpenAPIV3_1.HttpMethods

    this.extractValidation()
    this.extractSerialization()
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
  private extractSerialization() {
    if (!this.metadata.store.has('openapi:serialization')) return
    const dtoStore = Store.from(this.metadata.store.get('openapi:serialization'))

    this.responseProperties = this.extractProperties(dtoStore)
  }

  /**
   *
   */
  private extractValidation() {
    if (!this.metadata.store.has('openapi:validation')) return
    const dtoStore = Store.from(this.metadata.store.get('openapi:validation'))

    this.bodyProperties = this.extractProperties(dtoStore, false)
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
  private extractProperties(dtoStore: Store, isResponse = true) {
    if (!dtoStore.has('properties')) return {}

    const properties = dtoStore.get<DtoProperty[]>('properties')

    return Object.entries(properties).reduce((result, [key, value]) => {
      const { type, description, example, required } = value

      const properties = this.getSubProperties(type, isResponse)

      const formattedType = this.convertTypeToOpenApiTypes(type)

      if (!isResponse && required) this.requiredBodyProperties.push(key)

      result[key] = cleanObject({
        description,
        type: formattedType.type,
        format: formattedType.format,
        properties,
        example
      })

      return result
    }, {} as Record<string, any>)
  }

  private getSubProperties(propertyType: Function | string, isResponse: boolean) {
    if (!this.isClass(propertyType)) return undefined

    const store = Store.from(getClass(propertyType))
    return this.extractProperties(store, isResponse)
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

    const builtObject: OpenAPIV3_1.OperationObject = {
      tags,
      summary: this.summary,
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

    if (this.bodyProperties)
      builtObject.requestBody = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: this.bodyProperties,
              required: this.requiredBodyProperties
            }
          }
        }
      }

    return builtObject
  }
}
