import { getClass } from '@kodexo/common'
import { DevError } from '@kodexo/errors'
import { Store } from '@kodexo/injection'
import type { OpenAPIV3_1 } from 'openapi-types'
import { Class } from 'type-fest'
import { ApiModelOptions } from '../decorators'
import { cleanObject } from '../utils/cleanObject'
import { OpenApiService } from './OpenApiService'

export class OpenApiExtractor {
  private requiredProperties: Array<string> = []
  private properties: Record<string, any> = {}
  private multiple: boolean = false
  private ref?: string
  constructor(private readonly store: Store, private readonly openapiService: OpenApiService) {}

  /**
   *
   * @returns
   */
  public withDto(dto: Class) {
    const modelOptions = this.registerModel(dto)

    if (!modelOptions) return this

    this.ref = `#/components/schemas/${modelOptions.title}`

    return this
  }

  /**
   *
   * @param dto
   * @returns
   */
  private registerModel(dto: Class) {
    if (!this.store.has('openapi:model')) return

    const modelOptions = this.store.get<ApiModelOptions>('openapi:model')

    if (!this.openapiService.hasModel(dto)) this.openapiService.registerModel(dto, modelOptions)

    return modelOptions
  }

  /**
   *
   * @param multiple
   * @returns
   */
  public setMultiple(multiple: boolean) {
    this.multiple = multiple
    return this
  }

  /**
   *
   * @returns
   */
  public extract() {
    if (!this.ref) this.properties = this.extractProperties(this.store)
    return this
  }

  /**
   *
   */
  public buildSchema(): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject {
    const { properties, requiredProperties: required } = this

    if (this.ref)
      return this.multiple
        ? {
            type: 'array',
            items: { $ref: this.ref }
          }
        : {
            $ref: this.ref
          }

    const object = cleanObject({
      type: 'object',
      properties,
      required: required.length ? required : undefined
    })

    return this.multiple
      ? {
          type: 'array',
          items: object
        }
      : object
  }

  /**
   *
   */
  private extractProperties(store: Store) {
    if (!store.has('openapi:properties')) return {}

    const properties = this.store.get<DtoProperty[]>('openapi:properties')

    return Object.entries(properties).reduce((result, [key, value]) => {
      const { type, description, example, required, items } = value

      const properties = this.getSubProperties(type)
      const formattedType = this.convertTypeToOpenApiTypes(type)

      if (required) this.requiredProperties.push(key)

      switch (formattedType.type) {
        case 'ref':
          result[key] = {
            ...properties // contains $ref
          }
          break

        case 'array':
          const arrayProperties = this.getArrayProperties(key, items)

          result[key] = {
            type: formattedType.type,
            items: arrayProperties
          }
          break

        default:
          result[key] = {
            type: formattedType.type,
            format: formattedType.format,
            properties
          }
          break
      }

      result[key] = cleanObject({
        ...result[key],
        description,
        example
      })

      return result
    }, {} as Record<string, any>)
  }

  /**
   *
   */
  private getArrayProperties(key: string, items?: Array<Class | Function | string>) {
    // TODO: get information about concerned DTO
    if (!items)
      throw new DevError(
        `An @ApiProperty with type Array must have an items property on ******:${key}`,
        false
      )

    if (items.length === 0)
      throw new Error(
        `An @ApiProperty with type Array must have at least one item on ******:${key}`
      )

    if (items.length === 1) {
      const item = items[0]

      if (this.isClass(item)) {
        return { type: 'ref', ...this.getSubProperties(item) }
      }

      return this.convertTypeToOpenApiTypes(item)
    }
  }

  /**
   *
   * @param propertyType
   * @returns
   */
  private getSubProperties(propertyType: Function | string) {
    if (!this.isClass(propertyType)) return undefined

    const store = Store.from(getClass(propertyType))

    let extractor = OpenApiExtractor.fromStore(store, this.openapiService)

    if (store.has('openapi:model')) extractor.withDto(propertyType as Class)

    return extractor.extract().buildSchema()
  }

  /**
   *
   * @param propertyType
   */
  private convertTypeToOpenApiTypes(propertyType: Function | Class | string) {
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

      case 'Array':
        return { type: 'array' }
    }

    if (this.isClass(propertyType)) {
      const modelOptions = this.registerModel(propertyType as Class)
      return modelOptions ? { type: 'ref' } : { type: 'object' }
    }

    return { type: 'string' }
  }

  /**
   *
   * @param type
   * @returns
   */
  private isPrimitive(type: any) {
    return type?.name === 'String' || type?.name === 'Number' || type?.name === 'Boolean'
  }

  /**
   *
   * @param type
   * @returns
   */
  private isObject(type: any) {
    return type?.name === 'Date' || type?.name === 'Object' || type?.name === 'Array'
  }

  /**
   *
   * @param type
   * @returns
   */
  private isArray(type: any) {
    return type?.name === 'Array'
  }

  /**
   *
   * @param type
   * @returns
   */
  private isClass(type: any) {
    if (typeof type !== 'function') return false

    return !(this.isPrimitive(type) || this.isObject(type) || this.isArray(type))
  }

  /**
   *
   * @param store
   * @returns
   */
  static fromStore(store: Store, service: OpenApiService) {
    return new OpenApiExtractor(store, service)
  }

  /**
   *
   * @param model
   * @param service
   */
  static fromModel(model: Class, service: OpenApiService) {
    const store = Store.from(model)
    return OpenApiExtractor.fromStore(store, service)
  }
}

type DtoProperty = {
  type: Function | string
  description: string
  example?: any
  items?: Array<Function | Class | string>
  required?: boolean
}
