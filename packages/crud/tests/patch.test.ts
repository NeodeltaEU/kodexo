import { App } from '@neatsio/app'
import { providerRegistry } from '@neatsio/injection'
import { ConnectionDatabase } from '@neatsio/mikro-orm'
import { Server as HttpServer } from 'http'
import { FetchFunction, makeFetch } from 'supertest-fetch'
import { Car } from './mocks/features/cars/entities/car.entity'
import { Dealership } from './mocks/features/dealerships/entities/dealership.entity'
import { User } from './mocks/features/users/entities/user.entity'
import { Server } from './mocks/Server'

const headers = {
  'content-type': 'application/json'
}

describe('[Method]: PATCH', () => {
  let fetch: FetchFunction
  let connection: ConnectionDatabase
  let server: HttpServer

  beforeAll(async done => {
    server = await App.bootstrap(Server)

    fetch = makeFetch(server)

    connection = providerRegistry.resolve<ConnectionDatabase>(ConnectionDatabase).instance
    await connection.init()

    done()
  })

  afterAll(async done => {
    await connection.close()

    server.close(() => {
      done()
    })
  })

  describe('UpdateOne', () => {
    let carId: string

    beforeEach(async () => {
      await connection.syncSchema()

      const car = new Car()

      car.title = 'My first Car'
      carId = car.id

      await connection.orm.em.persistAndFlush(car)
    })

    it('should update a value of a car and return the response', async () => {
      const body = JSON.stringify({
        title: 'Modified car title'
      })

      const result = await fetch(`/cars/${carId}`, { method: 'PATCH', body, headers })
        .expect(200)
        .json()

      expect(result.id).toBe(carId)
      expect(result.title).toBe('Modified car title')

      const car = await connection.orm.em.findOneOrFail(Car, carId, { refresh: true })

      expect(car.title).toBe('Modified car title')
    })

    it('should update multiple value at a time and return the response', async () => {
      const body = JSON.stringify({
        title: 'Modified car title',
        doors: 4
      })

      const result = await fetch(`/cars/${carId}`, { method: 'PATCH', body, headers })
        .expect(200)
        .json()

      expect(result.id).toBe(carId)
      expect(result.title).toBe('Modified car title')
      expect(result.doors).toBe(4)

      const car = await connection.orm.em.findOneOrFail(Car, carId, { refresh: true })

      expect(car.title).toBe('Modified car title')
      expect(car.doors).toBe(4)
    })

    it('should return an error if a car does not exist', async () => {
      const body = JSON.stringify({
        title: 'Modified car title'
      })

      await fetch(`/cars/abc`, { method: 'PATCH', body, headers }).expect(404).json()
    })

    it('should return an error if a value is not valid', async () => {
      const body = JSON.stringify({
        title: 'Modified car title',
        doors: 'four'
      })

      await fetch(`/cars/${carId}`, { method: 'PATCH', body, headers }).expect(422).json()

      const car = await connection.orm.em.findOneOrFail(Car, carId, { refresh: true })

      expect(car.title).toBe('My first Car')
      expect(car.doors).toBeNull()
    })

    it('should return an error if not body passed', async () => {
      const body = JSON.stringify({})

      await fetch(`/cars/${carId}`, { method: 'PATCH', body, headers }).expect(422).json()
    })

    describe('Update a single association', () => {
      let dealershipId: string

      beforeEach(async () => {
        await connection.syncSchema()

        const car = new Car()
        car.title = 'My first Car'
        carId = car.id

        connection.orm.em.persist(car)

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        await connection.orm.em.flush()
      })

      it('should update a association ', async () => {
        const body = JSON.stringify({
          title: 'Car with dealership',
          dealership: dealershipId
        })

        const result = await fetch(`/cars/${carId}`, { method: 'PATCH', body, headers })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          title: 'Car with dealership',
          dealership: dealershipId
        })
      })

      it('shoud update a association then populate value', async () => {
        const body = JSON.stringify({
          title: 'Car with dealership',
          dealership: dealershipId
        })

        const result = await fetch(`/cars/${carId}?$populate=dealership`, {
          method: 'PATCH',
          body,
          headers
        })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          title: 'Car with dealership',
          dealership: {
            id: dealershipId,
            title: 'My first Dealership'
          }
        })
      })
    })

    describe('Update plural association', () => {
      let dealershipId: string, carId1: string, carId2: string, carId3: string

      beforeEach(async () => {
        await connection.syncSchema()

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        const car = new Car()
        car.title = 'My first Car'
        car.dealership = dealership
        carId1 = car.id
        connection.orm.em.persist(car)

        const car2 = new Car()
        car2.title = 'My second Car'
        carId2 = car2.id
        connection.orm.em.persist(car2)

        const car3 = new Car()
        car3.title = 'My third Car'
        carId3 = car3.id
        connection.orm.em.persist(car3)

        await connection.orm.em.flush()

        connection.orm.em.clear()
      })

      it('should update many cars on a single dealership', async () => {
        let car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })
        expect(car2.dealership).toBeNull()

        const body = JSON.stringify({
          cars: [carId1, carId2, carId3]
        })

        const result = await fetch(`/dealerships/${dealershipId}`, {
          method: 'PATCH',
          body,
          headers
        })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          id: dealershipId,
          cars: [carId1, carId2, carId3],
          title: 'My first Dealership'
        })

        car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })
        expect(car2).toMatchObject({
          title: 'My second Car',
          dealership: {
            id: dealershipId
          }
        })
      })

      it('should update an association with populated values input without populate', async () => {
        let car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })
        expect(car2.dealership).toBeNull()

        const body = JSON.stringify({
          cars: [
            {
              id: carId2
            },
            {
              id: carId3
            }
          ]
        })

        const result = await fetch(`/dealerships/${dealershipId}`, {
          method: 'PATCH',
          body,
          headers
        })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          id: dealershipId,
          cars: [carId2, carId3],
          title: 'My first Dealership'
        })

        car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })
        expect(car2).toMatchObject({
          title: 'My second Car',
          dealership: {
            id: dealershipId
          }
        })

        let car1 = await connection.orm.em.fork().findOneOrFail(Car, carId1, { refresh: true })
        expect(car1.dealership).toBeNull()
      })

      it('should update an association with populated values input & result is also populated', async () => {
        const body = JSON.stringify({
          cars: [
            {
              id: carId2
            },
            {
              id: carId3
            }
          ]
        })

        let car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })

        expect(car2.dealership).toBeNull()

        const result = await fetch(`/dealerships/${dealershipId}?$populate=cars`, {
          method: 'PATCH',
          body,
          headers
        })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          id: dealershipId,
          cars: [
            { id: carId2, title: 'My second Car' },
            { id: carId3, title: 'My third Car' }
          ],
          title: 'My first Dealership'
        })

        car2 = await connection.orm.em.findOneOrFail(Car, carId2, { refresh: true })

        expect(car2).toMatchObject({
          title: 'My second Car',
          dealership: {
            id: dealershipId
          }
        })

        let car1 = await connection.orm.em.findOneOrFail(Car, carId1, { refresh: true })

        expect(car1.dealership).toBeNull()
      })

      it('should remove a car from association on a single dealership', async () => {
        const body = JSON.stringify({
          cars: []
        })

        let car = await connection.orm.em.findOneOrFail(Car, carId1, { refresh: true })

        expect(car.dealership.id).toBe(dealershipId)

        const result = await fetch(`/dealerships/${dealershipId}`, {
          method: 'PATCH',
          body,
          headers
        })
          .expect(200)
          .json()

        expect(result).toMatchObject({
          id: dealershipId,
          cars: [],
          title: 'My first Dealership'
        })

        car = await connection.orm.em.findOneOrFail(Car, carId1, { refresh: true })

        expect(car).toMatchObject({
          title: 'My first Car',
          dealership: null
        })
      })
    })
  })
})
