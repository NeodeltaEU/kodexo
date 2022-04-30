import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { OpenAPIV3_1 } from 'openapi-types'
import { stringify } from 'yaml'
import { OpenApiPathItem } from '../openapi/OpenApiPath'
import { RoutesService } from './RoutesService'

@Service()
export class OpenApiService {
  constructor(@Inject private readonly routesService: RoutesService) {}

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

      paths[path] = pathItem
    })

    const document: OpenAPIV3_1.Document = {
      openapi: '3.1.0',
      info: {
        title: 'API',
        version: '1.0'
      },
      paths
    }

    return stringify(document)
  }
}
