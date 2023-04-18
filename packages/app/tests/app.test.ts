import { Server as HttpServer } from 'http'
import * as request from 'supertest'
import { App } from '../src/App'
import { Server } from './mocks/Server'

let server: HttpServer

describe('App', () => {
  beforeAll(async () => {
    server = await App.bootstrap(Server)
  })

  afterAll(() => {
    server.close()
  })

  it('should start a new app', async () => {
    await request(server).get('/').expect(404)
  })

  it('should have one controller', async () => {
    const { body }: any = await request(server).get('/controls/cars').expect(200)

    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({ model: 'Mégane', id: 1, registration: '11-111-111' })
  })

  it('should post on secured route', async () => {
    const { body }: any = await request(server)
      .post('/controls/cars/secured')
      .send({ test: 'test' })
      .expect(200)
  })

  it('should apply dto', async () => {
    const { body }: any = await request(server)
      .post('/controls/cars/newcar')
      .send({ test: 'test', name: 'onche' })
      .expect(200)

    expect(body.test).toBeUndefined()
    expect(body.name).toBe('onche')
  })

  it('should apply a middleware on an entire controller', async () => {
    const { body }: any = await request(server).post('/controls/houses').expect(200)

    expect(body.override).toBe(true)
  })

  it('should have cookie via @Res decorator availability', async () => {
    const agent = request.agent(server)

    const { body, headers }: any = await agent
      .post('/controls/cars/res')
      .send({ email: 'john.doe@acme.com' })
      .expect(200)

    expect(body.cookie).toBe(true)
    expect(body.email).toBe('john.doe@acme.com')

    const { body: body2 } = await agent.get('/controls/cars/cookies').expect(200)

    expect(body2.cookie).toBe('thevalue')
  })

  it('should create a sub controller from submodule', async () => {
    const { body }: any = await request(server).get('/sub').expect(200)

    expect(body.sub).toBe(true)
  })

  it('should load async service before controller imports', async () => {
    const { body }: any = await request(server).get('/sub/async').expect(200)

    expect(body.async).toBe(true)
  })

  it('should load async service from root controller module', async () => {
    const { body }: any = await request(server).get('/controls/houses/async').expect(200)

    expect(body.async).toBe(true)
  })

  it('should pass with admin group', async () => {
    const payload = {
      tires: 3
    }

    const { body } = await request(server)
      .post('/controls/cars/group?admin=true')
      .send(payload)
      .expect(200)

    const payload2 = {
      name: true,
      tires: 4
    }

    const { body: body2 } = await request(server)
      .post('/controls/cars/group?admin=true')
      .send(payload2)
      .expect(422)

    const payload3 = {
      name: true,
      tires: 3
    }

    const { body: body3 } = await request(server)
      .post('/controls/cars/group')
      .send(payload3)
      .expect(200)
  })
})
