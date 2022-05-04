import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { OpenAPIV3_1 } from 'openapi-types'
import { stringify } from 'yaml'
import { OpenApiPathItem } from './OpenApiPath'
import { RoutesService } from './RoutesService'

@Service()
export class OpenApiService {
  constructor(
    @Inject private readonly routesService: RoutesService,
    @Inject private readonly config: ConfigurationService
  ) {}

  /**
   *
   * @returns
   */
  processToYaml(): string {
    const routes = this.routesService.getDetailsRoutes()

    const paths: OpenAPIV3_1.PathsObject = {}

    routes.forEach((routeEndpoints, path) => {
      const pathItem = routeEndpoints.reduce((result, { endpoint }) => {
        const openApiPath = new OpenApiPathItem(endpoint)

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

    const document: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: {
        title: title || 'API',
        version: version || '1.0'
      },
      servers: [{ url: url || 'http://localhost:3000' }],
      paths
    }

    return stringify(document)
  }
}
