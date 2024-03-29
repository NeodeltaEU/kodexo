import { Endpoint, Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { OpenAPIV3_1 } from 'openapi-types'
import { Class } from 'type-fest'
import { stringify } from 'yaml'
import { ApiModelOptions } from '../decorators'
import { cleanObject } from '../utils/cleanObject'
import { OpenApiExtractor } from './OpenApiExtractor'
import { OpenApiPathItem } from './OpenApiPathItem'

@Service()
export class OpenApiService {
  private models: Map<Class<any>, ApiModelOptions> = new Map()
  public readonly pathIdType: string

  constructor(@Inject private readonly config: ConfigurationService) {
    this.pathIdType = this.config.get('openapi.pathIdType') || 'uuid'
  }

  /**
   *
   * @param model
   * @returns
   */
  public hasModel(model: Class<any>): boolean {
    return this.models.has(model)
  }

  /**
   *
   * @param model
   * @param options
   */
  public registerModel(model: Class<any>, options: ApiModelOptions) {
    this.models.set(model, options)
  }

  /**
   *
   * @returns
   */
  private generateComponents(): OpenAPIV3_1.ComponentsObject {
    const schemas = Array.from(this.models.entries()).reduce((result, [model, options]) => {
      result[options.title] = OpenApiExtractor.fromModel(model, this).extract().buildSchema()

      return result
    }, {} as Record<string, OpenAPIV3_1.SchemaObject>)

    return cleanObject({
      schemas
    })
  }

  /**
   *
   * @returns
   */
  processToYaml(routes: Map<string, RouteEndpoint[]>): string {
    const paths: OpenAPIV3_1.PathsObject = {}

    routes.forEach((routeEndpoints, path) => {
      const pathItem = routeEndpoints.reduce((result, { endpoint }) => {
        const openApiPath = new OpenApiPathItem(this, endpoint)

        // TS def lib WTF??
        result[openApiPath.method] = openApiPath.toObject() as any

        return result
      }, {} as OpenAPIV3_1.PathItemObject)

      // TODO: verify this is correct
      const formattedPath = path.replace(/:([A-Za-z0-9]*)/g, '{$1}')

      paths[formattedPath] = pathItem
    })

    const title = this.config.get('openapi.title')
    const version = this.config.get('openapi.version')
    const url = this.config.get('openapi.url')

    const components = this.generateComponents()

    const document: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: {
        title: title || 'API',
        version: version || '1.0'
      },
      servers: [{ url: url || 'http://localhost:3000' }],
      paths,
      components
    }

    return stringify(document)
  }
}

type ApiModelObject = {
  model: Class<any>
  title: string
  description?: string
}

type RouteEndpoint = {
  endpoint: Endpoint
}
