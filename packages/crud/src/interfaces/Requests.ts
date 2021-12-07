import { Request, URLParams } from '@uminily/common'

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
  req: Request
  filter: any
  fields?: Array<string>
  orderBy?: string
  limit: number
  offset?: number
  populate?: Array<string>
}

export type OverrideQuery = Partial<Omit<QueryParsedResult, 'req'>>
export type MergeQuery = Partial<Omit<QueryParsedResult, 'req' | 'orderBy' | 'limit' | 'offset'>>
