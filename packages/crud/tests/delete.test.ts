import { App } from '@kodexo/app'
import { providerRegistry } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { Server as HttpServer } from 'http'
import { FetchFunction, makeFetch } from 'supertest-fetch'
import { Car } from './mocks/features/cars/entities/car.entity'
import { Dealership } from './mocks/features/dealerships/entities/dealership.entity'
import { Server } from './mocks/Server'

describe('[Method]: DELETE', () => {
  let fetch: FetchFunction
  let connection: ConnectionDatabase
  let server: HttpServer

  beforeAll(async () => {
    server = await App.bootstrap(Server)

    fetch = makeFetch(server)

    connection = providerRegistry.resolve<ConnectionDatabase>(ConnectionDatabase).instance
    await connection.init()
    await connection.syncSchema()
  })

  afterAll(async () => {
    await connection.close()

    server.close()
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

  describe('Soft Delete', () => {
    let dealership1Id: string
    let dealership2Id: string

    beforeAll(async () => {
      await connection.syncSchema()

      const dealership = new Dealership()
      dealership.title = 'My first dealership'

      dealership1Id = dealership.id

      const dealership2 = new Dealership()
      dealership2.title = 'My second dealership'

      dealership2Id = dealership2.id

      connection.orm.em.persist([dealership, dealership2])

      await connection.orm.em.flush()
    })

    it('should soft delete a dealership', async () => {
      const result = await fetch(`/dealerships/${dealership1Id}`, { method: 'DELETE' })
        .expect(200)
        .json()

      expect(result.id).toBe(dealership1Id)
      expect(result.deletedAt).toBeDefined()

      const dealership = await connection.orm.em.fork().findOne(Dealership, dealership1Id)
      expect(dealership).toBeNull()

      const dealershipForceFilter = await connection.orm.em
        .fork()
        .findOne(Dealership, dealership1Id, {
          filters: {
            softDelete: { isDeleted: true }
          }
        })

      expect(dealershipForceFilter).toBeDefined()
    })

    it('should getMany without $deleted param returns only good items', async () => {
      const resultGetMany = await fetch(`/dealerships`).expect(200).json()
      expect(resultGetMany.length).toBe(1)
      expect(resultGetMany[0].id).toBe(dealership2Id)
    })

    it('should getMany with $deleted param set to all returns all items', async () => {
      const resultGetMany = await fetch(`/dealerships?$deleted=all`).expect(200).json()
      expect(resultGetMany.length).toBe(2)
    })

    it('should getMany with $deleted param set to true returns only deleted items', async () => {
      const resultGetMany = await fetch(`/dealerships?$deleted=true`).expect(200).json()
      expect(resultGetMany.length).toBe(1)
      expect(resultGetMany[0].id).toBe(dealership1Id)
    })

    it('should getMany with $deleted param set to false returns only good items', async () => {
      const resultGetMany = await fetch(`/dealerships?$deleted=false`).expect(200).json()
      expect(resultGetMany.length).toBe(1)
      expect(resultGetMany[0].id).toBe(dealership2Id)
    })

    it('should recovery a soft deleted dealership', async () => {
      const result = await fetch(`/dealerships/${dealership1Id}/recovery`, { method: 'GET' })
        .expect(200)
        .json()

      expect(result.id).toBe(dealership1Id)
    })
  })
})
