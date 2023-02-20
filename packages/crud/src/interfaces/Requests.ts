import { Request, URLParams } from '@kodexo/common'

export interface RequestWithOverride extends Request {
  override?: OverrideQuery
}

export interface RequestWithMerge extends Request {
  merge?: MergeQuery
}

export interface RequestCrud extends RequestWithOverride, RequestWithMerge {}

export type RequestParserOptions = {
  createDto?: any
  updateDto?: any
  parseIntId?: boolean
  limitDeepPopulate: number
}

export type RequestParsedResult = {
  pathParams: URLParams
  queryParams: QueryParsedResult
  assign: any
  createDto: any
  updateDto: any
}

export type QueryParsedResult = {
  req?: Request
  filter?: any
  fields?: Array<string>
  orderBy?: string
  limit?: number
  offset?: number
  deleted: string
  populate?: Array<string>
}

export type OverrideQuery = Partial<Omit<QueryParsedResult, 'req' | 'deleted'>>
export type MergeQuery = Partial<
  Omit<QueryParsedResult, 'req' | 'orderBy' | 'limit' | 'offset' | 'deleted'>
>
