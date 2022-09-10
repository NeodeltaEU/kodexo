/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Handler, Request, Response } from '@tinyhttp/app'
import { AnyRouter } from '@trpc/server'
import {
  NodeHTTPCreateContextFnOptions,
  NodeHTTPHandlerOptions,
  nodeHTTPRequestHandler
} from '@trpc/server/adapters/node-http'

export type CreateTinyContextOptions = NodeHTTPCreateContextFnOptions<Request, Response>

export function createTinyHttpMiddleware<TRouter extends AnyRouter>(
  opts: NodeHTTPHandlerOptions<TRouter, Request, Response>
): Handler {
  return async (req, res) => {
    const endpoint = req.path.split('/').slice(-1).join()

    await nodeHTTPRequestHandler({
      ...opts,
      req,
      res,
      path: endpoint
    })
  }
}
