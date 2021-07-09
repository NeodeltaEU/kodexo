import { Request, URLParams } from '@uminily/app'
import { plainToClass } from 'class-transformer'
import { ConnectionDatabase } from '../../mikro-orm/src'
import { REQUEST_CONTEXT } from './constants'
import { QueryParsedResult, QueryParser } from './QueryParser'

export class RequestParser {
  private createDto: { [key: string]: any } = {}
  private updateDto: { [key: string]: any } = {}
  private pathParams = {}
  private queryParams: QueryParsedResult

  constructor(
    private req: Request,
    private options: RequestParserOptions = {},
    private currentEntity?: string
  ) {
    this.parseCreateDto()
    this.parseUpdateDto()
    this.parseQuery()

    this.pathParams = this.req.params || {}
  }

  /**
   *
   */
  parseQuery() {
    this.queryParams = QueryParser.parse(this.req, this.currentEntity)
  }

  /**
   *
   * @returns
   */
  parseCreateDto() {
    if (!Object.keys(this.req.body).length) return

    this.createDto = this.options.createDto
      ? plainToClass(this.options.createDto, this.req.body)
      : this.req.body
  }

  /**
   *
   * @returns
   */
  parseUpdateDto() {
    if (!Object.keys(this.req.body).length) return

    this.updateDto = this.options.updateDto
      ? plainToClass(this.options.updateDto, this.req.body)
      : this.req.body

    // Overload DTO with request property for customs validators via class-validator
    this.updateDto[REQUEST_CONTEXT] = { id: this.req.params?.id }
  }

  /**
   *
   */
  render(): RequestParsedResult {
    const { createDto, updateDto, pathParams, queryParams } = this

    return {
      pathParams,
      queryParams,
      createDto,
      updateDto
    }
  }

  /**
   *
   * @param req
   * @returns
   */
  static parse(req: Request, options: RequestParserOptions, currentEntity?: string) {
    //console.log(connection.entitiesMetadata)

    const requestParser = new RequestParser(req, options, currentEntity)

    return requestParser.render()
  }
}

export type RequestParserOptions = {
  createDto?: any
  updateDto?: any
}

export type RequestParsedResult = {
  pathParams: URLParams
  queryParams: QueryParsedResult
  createDto: any
  updateDto: any
}
