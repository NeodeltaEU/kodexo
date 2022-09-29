describe('Global', () => {
  /*let server: HttpServer

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

    console.log({ value })

    const result = await client.users.onche.query(123)

    console.log({ result })
  })*/

  it('should true to be true', async () => {
    expect(true).toBe(true)
  })
})
