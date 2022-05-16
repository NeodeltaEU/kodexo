import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { OpenAPIV3_1 } from 'openapi-types'
import { Class } from 'type-fest'
import { stringify } from 'yaml'
import { ApiModelOptions } from '../decorators'
import { cleanObject } from '../utils/cleanObject'
import { OpenApiExtractor } from './OpenApiExtractor'
import { OpenApiPathItem } from './OpenApiPath'
import { RoutesService } from './RoutesService'

@Service()
export class OpenApiService {
  private models: Map<Class, ApiModelOptions> = new Map()

  constructor(
    @Inject private readonly routesService: RoutesService,
    @Inject private readonly config: ConfigurationService
  ) {}

  /**
   *
   * @param model
   * @returns
   */
  public hasModel(model: Class): boolean {
    return this.models.has(model)
  }

  /**
   *
   * @param model
   * @param options
   */
  public registerModel(model: Class, options: ApiModelOptions) {
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
  processToYaml(): string {
    const routes = this.routesService.getDetailsRoutes()

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
  model: Class
  title: string
  description?: string
}
