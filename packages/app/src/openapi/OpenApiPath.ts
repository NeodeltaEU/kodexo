import { Endpoint } from '@kodexo/common'
import { OpenAPIV3_1 } from 'openapi-types'

export class OpenApiPathItem {
  public readonly method: OpenAPIV3_1.HttpMethods

  constructor(private metadata: Endpoint) {
    const method = metadata.method as unknown
    this.method = method as OpenAPIV3_1.HttpMethods

    console.log(metadata.store.size)

    if (metadata.store.size > 1) console.log(metadata.store)
  }

  toObject(): OpenAPIV3_1.OperationObject {
    return {
      summary: 'Create New User',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    description: 'Name',
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
