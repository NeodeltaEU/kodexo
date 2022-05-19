import { Endpoint, getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import type { OpenAPIV3_1 } from 'openapi-types'
import { OpenApiExtractor } from './OpenApiExtractor'
import { OpenApiService } from './OpenApiService'

export class OpenApiPathItem {
  public readonly method: OpenAPIV3_1.HttpMethods

  private responseProperties: Record<string, any> = {}
  private bodyProperties?: Record<string, any>
  private requiredBodyProperties: Array<string> = []
  private summary: string = 'A route'
  private apiGroup?: string
  private store: Store

  constructor(private openApiService: OpenApiService, private metadata: Endpoint) {
    const method = metadata.method as unknown
    this.method = method as OpenAPIV3_1.HttpMethods

    this.store = this.metadata.store

    //this.extractValidation()
    //this.extractSerialization()
    this.extractSummary()
    this.extractApiGroup()
  }

  /**
   *
   */
  private extractApiGroup() {
    this.apiGroup = Store.from(getClass(this.metadata.target)).get('openapi:group')
  }

  /*  private extractSerialization() {
    if (!this.metadata.store.has('openapi:serialization')) return

    const dto = this.metadata.store.get('openapi:serialization')

    const dtoStore = Store.from(dto)

    if (dtoStore.has('openapi:model')) {
      const modelOptions = dtoStore.get<ApiModelOptions>('openapi:model')
      this.openApiService.registerModel(dto, modelOptions)
      this.responseProperties = this.extractSchemaFromDto(dto, modelOptions)
    } else {
      this.responseProperties = this.extractProperties(dtoStore)
    }
  }

  private extractValidation() {
    if (!this.metadata.store.has('openapi:validation')) return
    const dtoStore = Store.from(this.metadata.store.get('openapi:validation'))

    this.bodyProperties = this.extractProperties(dtoStore, false)
  }*/

  /**
   *
   * @returns
   */
  private extractSummary() {
    if (!this.metadata.store.has('openapi:summary')) return
    this.summary = this.metadata.store.get('openapi:summary')
  }

  /**
   *
   * @returns
   */
  toObject(): OpenAPIV3_1.OperationObject {
    const tags = this.apiGroup ? [this.apiGroup] : []

    let responseSchema = {},
      bodySchema

    // Response Schema
    if (this.metadata.store.has('openapi:serialization')) {
      const dtoSerialized = this.metadata.store.get('openapi:serialization')

      const dtoSerializedStore =
        Store.fromClass(dtoSerialized).mergeFromHerited('openapi:properties')

      const multiple = this.store.get('openapi:serialization:multiple') ?? false

      responseSchema = OpenApiExtractor.fromStore(dtoSerializedStore, this.openApiService)
        .withDto(dtoSerialized)
        .setMultiple(multiple)
        .extract()
        .buildSchema()
    }

    // Body Schema
    if (this.metadata.store.has('openapi:validation')) {
      const dtoValidation = this.metadata.store.get('openapi:validation')
      const dtoValidationStore =
        Store.fromClass(dtoValidation).mergeFromHerited('openapi:properties')

      bodySchema = OpenApiExtractor.fromStore(dtoValidationStore, this.openApiService)
        .extract()
        .buildSchema()
    }

    const builtObject: OpenAPIV3_1.OperationObject = {
      tags,
      summary: this.summary,
      responses: {
        [this.metadata.statusCode]: {
          description: 'Success',
          content: {
            'application/json': {
              schema: responseSchema
            }
          }
        }
      }
    }

    if (bodySchema)
      builtObject.requestBody = {
        content: {
          'application/json': {
            schema: bodySchema
          }
        }
      }

    return builtObject
  }
}
