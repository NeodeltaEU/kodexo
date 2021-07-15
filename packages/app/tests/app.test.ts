import { Server as HttpServer } from 'http'
import { Server } from './mocks/Server'
import * as request from 'supertest'
import { App } from '../src/App'

let server: HttpServer

describe('App', () => {
  beforeAll(async done => {
    server = await App.bootstrap(Server)
    done()
  })

  it('should start a new app', async () => {
    const result = await request(server).get('/').expect(404)

    console.log('wesh')
  })

  it('should have one controller', async () => {
    const { body }: any = await request(server).get('/cars').expect(200)

    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({ model: 'Mégane', id: 1, registration: '11-111-111' })
  })
})
