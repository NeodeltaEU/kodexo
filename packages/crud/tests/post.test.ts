import { App } from '@kodexo/app'
import { providerRegistry } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { Server as HttpServer } from 'http'
import { FetchFunction, makeFetch } from 'supertest-fetch'
import { User } from './mocks/features/users/entities/user.entity'
import { Server } from './mocks/Server'

const headers = {
  'content-type': 'application/json'
}

describe('[Method]: POST', () => {
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

  describe('CreateOne', () => {
    beforeAll(async () => {
      await connection.syncSchema()
    })

    it('should create an user in DB & return result to the client', async () => {
      const body = JSON.stringify({
        email: 'john.doe@acme.com'
      })

      const result = await fetch(`/users`, { method: 'POST', body, headers }).expect(201).json()

      expect(result.id).toBeDefined()
      expect(result.email).toBe('john.doe@acme.com')

      const userFoundInDatabase = await connection.orm.em.findOne(User, result.id)

      expect(userFoundInDatabase).toBeDefined()
      expect(userFoundInDatabase?.email).toBe('john.doe@acme.com')
    })

    it('should return an error with empty body', async () => {
      await fetch(`/users`, { method: 'POST', headers }).expect(422)
    })

    it('should return an error with malformed body', async () => {
      const body = JSON.stringify({
        email: 'this is not an email'
      })

      const error = await fetch(`/users`, { method: 'POST', body, headers }).expect(422).json()

      expect(error.statusCode).toBe(422)
      expect(error.message).toBeDefined()
      expect(error.details).toHaveLength(1)
    })

    describe('Create with single association', () => {
      let userId: string

      beforeEach(async () => {
        await connection.syncSchema()

        const user = new User()
        user.email = 'john.doe@acme.com'
        userId = user.id

        await connection.orm.em.persistAndFlush(user)
      })

      it('should create a car with association to a specific owner through his id', async () => {
        const body = JSON.stringify({
          title: 'My first Car',
          owner: userId
        })

        const result = await fetch(`/cars`, { method: 'POST', body, headers }).expect(201).json()

        expect(result.title).toBe('My first Car')
        expect(result.owner).toBe(userId)
      })

      it('should create a car with association to a specific owner through his id, then populate owner', async () => {
        const body = JSON.stringify({
          title: 'My first Car',
          owner: userId
        })

        const result = await fetch(`/cars?$populate=owner`, { method: 'POST', body, headers })
          .expect(201)
          .json()

        expect(result.title).toBe('My first Car')
        expect(result.owner).toMatchObject({ id: userId, email: 'john.doe@acme.com' })
      })

      it('should create a car with association to a specific owner through user populate object', async () => {
        const body = JSON.stringify({
          title: 'My first Car',
          owner: {
            id: userId
          }
        })

        const result = await fetch(`/cars`, { method: 'POST', body, headers }).expect(201).json()

        expect(result.title).toBe('My first Car')
        expect(result.owner).toBe(userId)
      })

      it('should return an error when association is not possible for unexisting owner id', async () => {
        const body = JSON.stringify({
          title: 'My first Car',
          owner: 'abc'
        })

        const error = await fetch(`/cars`, { method: 'POST', body, headers }).expect(422).json()

        expect(error.statusCode).toBe(422)
        expect(error.message).toBeDefined()
        expect(error.details).toHaveLength(1)
        expect(error.details[0].property).toBe('owner')
      })

      it('should return an error when association is not possible for unexisting owner id through user object', async () => {
        const body = JSON.stringify({
          title: 'My first Car',
          owner: {
            id: 'abc'
          }
        })

        const error = await fetch(`/cars`, { method: 'POST', body, headers }).expect(422).json()

        expect(error.statusCode).toBe(422)
        expect(error.message).toBeDefined()
        expect(error.details).toHaveLength(1)
        expect(error.details[0].property).toBe('owner')
      })
    })

    describe('Create with array association', () => {
      let userIds: string[] = []

      beforeEach(async () => {
        await connection.syncSchema()

        const user = new User()
        user.email = 'john.doe@acme.com'
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        userIds = [user.id, user2.id, user3.id]

        await connection.orm.em.flush()
      })

      it('should create a dealership with customers association through their ids without populate', async () => {
        const body = JSON.stringify({
          title: 'My first Dealership',
          customers: userIds
        })

        const result = await fetch(`/dealerships`, { method: 'POST', body, headers })
          .expect(201)
          .json()

        expect(result.title).toBe('My first Dealership')

        expect(result.customers).toHaveLength(3)
        expect(result.cars).toHaveLength(0)

        const user1Updated = await connection.orm.em.findOneOrFail(User, userIds[0], {
          populate: ['favoriteDealerships'],
          refresh: true
        })

        expect(user1Updated.favoriteDealerships[0]).toMatchObject({
          id: result.id,
          title: 'My first Dealership'
        })
      })

      it('should create a dealership with customers association through their ids and customers populate', async () => {
        const body = JSON.stringify({
          title: 'My first Dealership',
          customers: userIds
        })

        const result = await fetch(`/dealerships?$populate=customers`, {
          method: 'POST',
          body,
          headers
        })
          .expect(201)
          .json()

        expect(result.title).toBe('My first Dealership')
        expect(result.customers).toHaveLength(3)
        expect(result.customers[0]).toMatchObject({ id: userIds[0], email: 'john.doe@acme.com' })
      })

      it('should create a dealership without customers', async () => {
        const body = JSON.stringify({
          title: 'My first Dealership'
        })

        const result = await fetch(`/dealerships`, {
          method: 'POST',
          body,
          headers
        })
          .expect(201)
          .json()

        expect(result.title).toBe('My first Dealership')
        expect(result.customers).toHaveLength(0)
        expect(result.cars).toHaveLength(0)
      })

      it('should return an error when a customer does not exist', async () => {
        const body = JSON.stringify({
          title: 'My first Dealership',
          customers: [...userIds, 'abc']
        })

        const error = await fetch(`/dealerships`, {
          method: 'POST',
          body,
          headers
        })
          .expect(422)
          .json()

        expect(error.statusCode).toBe(422)
        expect(error.details).toHaveLength(1)
      })
    })

    describe('Create with embedded entity', () => {
      beforeEach(async () => {
        await connection.syncSchema()
      })

      it('should return an error when embedded entity is not valid', async () => {
        const body = JSON.stringify({
          name: 'Customer',
          address: {
            city: 'Paris',
            postalCode: 75000
          }
        })

        const error = await fetch('/customers', { method: 'POST', body, headers })
          .expect(422)
          .json()

        expect(error.statusCode).toBe(422)
        expect(error.details).toHaveLength(2)
      })

      it('should be good with embedded full entity', async () => {
        const body = JSON.stringify({
          name: 'Customer',
          address: {
            city: 'Paris',
            postalCode: '75000',
            street: '1 rue de la tour'
          }
        })

        const result = await fetch('/customers', { method: 'POST', body, headers })
          .expect(201)
          .json()
      })
    })
  })
})
