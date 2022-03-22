import { App } from '@kodexo/app'
import { Server as HttpServer } from 'http'
import * as request from 'supertest'
import { Server } from './mocks/server'
import S3rver = require('s3rver')

describe('Upload', () => {
  it('should true to be true', () => {
    expect(true).toBe(true)
  })

  /*let server: HttpServer
  let s3: S3rver

  beforeAll(async done => {
    server = await App.bootstrap(Server)

    s3 = new S3rver({
      configureBuckets: [
        {
          name: 'test-bucket',
          configs: []
        }
      ]
    })

    await s3.run()

    done()
  })

  afterAll(async done => {
    await s3.close()
  })

  describe('Upload one file', () => {
    it('should upload a file', () => {
      return request(server)
        .post('/files/upload')
        .attach('file', 'tests/data/file.markdown')
        .then(res => {
          expect(res.status).toEqual(200)
        })
    })
  })*/
})
