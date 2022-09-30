import { boot } from '@kodexo/app'
import { createTRPCProxyClient } from '@trpc/client'
import { Server as HttpServer } from 'http'
import fetch from 'node-fetch'
import { AppRouter } from './fixtures/app.trpc-router'
import { Server } from './fixtures/server'

describe('Global', () => {
  let server: HttpServer

  const client = createTRPCProxyClient<AppRouter>({
    url: 'http://localhost:3000/trpc',
    fetch
  })

  beforeAll(async () => {
    server = (await boot(Server)) as HttpServer
  })

  afterAll(async () => {
    await server.close()
  })

  it('should true to be true', async () => {
    const value = await client.users.greeting.query()
    const result = await client.users.onche.query(123)

    console.log(result)
  })
})
