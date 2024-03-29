import { HttpError } from '@kodexo/errors'
import { plainToInstance } from 'class-transformer'
import { Allow } from 'class-validator'
import { REQUEST_CONTEXT } from './constants'
import {
  QueryParsedResult,
  RequestCrud,
  RequestParsedResult,
  RequestParserOptions
} from './interfaces'
import { QueryParser } from './QueryParser'

export class RequestParser {
  private createDto: { [key: string]: any } = {}
  private updateDto: { [key: string]: any } = {}
  private assign: any = {}
  private pathParams: any = {}
  private queryParams: QueryParsedResult

  constructor(
    private req: RequestCrud,
    private options: RequestParserOptions,
    private currentEntity?: string
  ) {
    this.parseCreateDto()
    this.parseUpdateDto()
    this.parseQuery()
    this.parseAssign()
    this.parsePathParams()
  }

  /**
   *
   */
  parsePathParams() {
    this.pathParams = this.req.params || {}

    if (this.options.parseIntId && this.pathParams.id) {
      this.pathParams.id = parseInt(this.pathParams.id, 10)

      if (Number.isNaN(this.pathParams.id)) throw HttpError.BadRequest('Invalid id')
    }
  }

  /**
   *
   */
  parseAssign() {
    if (this.req.assign) this.assign = this.req.assign
  }

  /**
   *
   */
  parseQuery() {
    const { limitDeepPopulate } = this.options
    const options = { limitDeepPopulate, currentEntity: this.currentEntity }
    this.queryParams = QueryParser.parse(this.req, options)
  }

  /**
   *
   * @returns
   */
  parseCreateDto() {
    if (!Object.keys(this.req.body).length) return

    this.createDto = this.options.createDto
      ? plainToInstance(this.options.createDto, this.req.body)
      : this.req.body
  }

  /**
   *
   * @returns
   */
  parseUpdateDto() {
    if (!Object.keys(this.req.body).length) return

    this.updateDto = this.options.updateDto
      ? plainToInstance(this.options.updateDto, this.req.body)
      : this.req.body

    // Overload DTO with request property for customs validators via class-validator
    this.updateDto[REQUEST_CONTEXT] = { id: this.req.params?.id }
    Allow()(this.updateDto, REQUEST_CONTEXT)
  }

  /**
   *
   */
  render(): RequestParsedResult {
    const { createDto, updateDto, pathParams, queryParams, assign } = this

    return {
      pathParams,
      queryParams,
      assign,
      createDto,
      updateDto
    }
  }

  /**
   *
   * @param req
   * @returns
   */
  static parse(req: RequestCrud, options: RequestParserOptions, currentEntity?: string) {
    const requestParser = new RequestParser(req, options, currentEntity)
    return requestParser.render()
  }
}
