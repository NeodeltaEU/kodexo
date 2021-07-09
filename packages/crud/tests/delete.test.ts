import { Server as HttpServer } from 'http'
import { ConnectionDatabase } from '@neatsio/mikro-orm'
import { App } from '@neatsio/app'
import { providerRegistry } from '@neatsio/injection'
import { makeFetch, FetchFunction } from 'supertest-fetch'

import { Server } from './mocks/Server'
import { Car } from './mocks/features/cars/entities/car.entity'

describe('[Method]: DELETE', () => {
  let fetch: FetchFunction
  let connection: ConnectionDatabase
  let server: HttpServer

  beforeAll(async done => {
    server = await App.bootstrap(Server)

    fetch = makeFetch(server)

    connection = providerRegistry.resolve<ConnectionDatabase>(ConnectionDatabase).instance
    await connection.init()
    await connection.syncSchema()

    done()
  })

  afterAll(async done => {
    await connection.close()

    server.close(() => {
      done()
    })
  })

  describe('DeleteOne', () => {
    let carId: string

    beforeAll(async () => {
      await connection.syncSchema()

      const car = new Car()
      car.title = 'My first Car'
      connection.orm.em.persist(car)

      carId = car.id

      await connection.orm.em.flush()
    })

    it('should delete the car', async () => {
      const result = await fetch(`/cars/${carId}`, { method: 'DELETE' }).expect(200).json()

      expect(result.id).toBe(carId)
      expect(result.deletedAt).toBeDefined()

      const car = await connection.orm.em.fork().findOne(Car, carId)

      expect(car).toBeNull()
    })

    it('should return an error if a car does not exist', async () => {
      await fetch(`/cars/${carId}`, { method: 'DELETE' }).expect(404).json()
    })
  })
})
