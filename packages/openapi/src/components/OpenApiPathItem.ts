import { Endpoint, getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import type { OpenAPIV3_1 } from 'openapi-types'
import { OpenApiExtractor } from './OpenApiExtractor'
import { PathParam } from './OpenApiPathParam'
import { OpenApiService } from './OpenApiService'

export class OpenApiPathItem {
  public readonly method: OpenAPIV3_1.HttpMethods

  private summary: string = 'A route'
  private apiGroup?: string
  private store: Store

  constructor(private openApiService: OpenApiService, private metadata: Endpoint) {
    const method = metadata.method as unknown
    this.method = method as OpenAPIV3_1.HttpMethods

    this.store = this.metadata.store

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
   * @returns
   */
  private extractSummary() {
    if (!this.store.has('openapi:summary')) return
    this.summary = this.metadata.store.get('openapi:summary')
  }

  /**
   *
   * @returns
   */
  private getResponseSchema() {
    if (!this.store.has('openapi:serialization')) return {}

    const dtoSerialized = this.store.get('openapi:serialization')

    const dtoSerializedStore = Store.fromClass(dtoSerialized).mergeFromHerited('openapi:properties')

    const multiple = this.store.get('openapi:serialization:multiple') ?? false

    return OpenApiExtractor.fromStore(dtoSerializedStore, this.openApiService)
      .withDto(dtoSerialized)
      .setMultiple(multiple)
      .extract()
      .buildSchema()
  }

  /**
   *
   */
  private getBodySchema() {
    if (!this.store.has('openapi:validation')) return

    const dtoValidation = this.store.get('openapi:validation')
    const dtoValidationStore = Store.fromClass(dtoValidation).mergeFromHerited('openapi:properties')

    return OpenApiExtractor.fromStore(dtoValidationStore, this.openApiService)
      .extract()
      .buildSchema()
  }

  /**
   *
   */
  private getPathParamaters(): OpenAPIV3_1.ParameterObject[] {
    // When params decorators are bypass
    if (this.store.has('openapi:pathParams')) {
      const isUuid = this.openApiService.pathIdType === 'uuid'

      const schema: OpenAPIV3_1.NonArraySchemaObject = isUuid
        ? { type: 'string', format: 'uuid' }
        : { type: this.openApiService.pathIdType as PathIdType }

      return this.store.get<PathParam[]>('openapi:pathParams').map(parameter => {
        return {
          name: parameter.name,
          schema,
          description: parameter.description,
          required: parameter.required || true,
          in: 'path'
        }
      }) as any // TODO: fix this
    }

    // When params decorators are used
    const { paramsStores } = this.metadata

    if (paramsStores.length > 0) {
      return paramsStores
        .filter(paramsStore => paramsStore.has('openapi:pathParam'))
        .map(paramsStore => {
          const pathParam = paramsStore.get('openapi:pathParam')

          return {
            name: paramsStore.get<string>('paramName'),
            schema: {
              type: 'string'
            },
            description: pathParam.description,
            required: true,
            in: 'path'
          }
        })
    }

    return []
  }

  /**
   *
   * @returns
   */
  toObject(): OpenAPIV3_1.OperationObject {
    const tags = this.apiGroup ? [this.apiGroup] : []

    const responseSchema = this.getResponseSchema()
    const bodySchema = this.getBodySchema()
    const paramaters = this.getPathParamaters()

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

    //
    if (paramaters?.length > 0) {
      builtObject.parameters = paramaters
    }

    //
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

type PathIdType = 'string' | 'integer'
