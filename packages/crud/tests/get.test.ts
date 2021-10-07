import { App } from '@uminily/app'
import { providerRegistry } from '@uminily/injection'
import { ConnectionDatabase } from '@uminily/mikro-orm'
import * as faker from 'faker'
import { Server as HttpServer } from 'http'
import { FetchFunction, makeFetch } from 'supertest-fetch'
import { Car } from './mocks/features/cars/entities/car.entity'
import { Dealership } from './mocks/features/dealerships/entities/dealership.entity'
import { Profile } from './mocks/features/profiles/entities/profile.entity'
import { User } from './mocks/features/users/entities/user.entity'
import { Workshop } from './mocks/features/workshops/entities/workshop.entity'
import { Server } from './mocks/Server'

describe('[Method]: GET', () => {
  let fetch: FetchFunction
  let connection: ConnectionDatabase
  let server: HttpServer

  beforeAll(async done => {
    server = await App.bootstrap(Server)

    fetch = makeFetch(server)

    // TODO: externalize connection for testing !!!
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

  /**
   * GET ONE
   */
  describe('GetOne', () => {
    let id: string

    beforeAll(async () => {
      await connection.syncSchema()

      const car = new Car()
      car.title = 'My first Car'
      connection.orm.em.persist(car)

      id = car.id

      await connection.orm.em.flush()
    })

    describe('- Simple cases', () => {
      it('should return a car entity on /cars/:id', async () => {
        const result = await fetch(`/cars/${id}`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result).toMatchObject({ id, title: 'My first Car' })
      })

      it('should return a 404 error /cars/:id when id not exist', async () => {
        await fetch(`/cars/abc`).expect(404).expect('content-type', 'application/json')
      })
    })

    describe('- Populating & sub-populating', () => {
      const initialCarData = [
        { title: 'My first Car' },
        { title: 'My second Car' },
        { title: 'My last Car' }
      ]

      let dealershipId: string

      beforeAll(async () => {
        await connection.syncSchema()

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        const dealership2 = new Dealership()
        dealership2.title = 'My second Dealership'
        connection.orm.em.persist(dealership2)

        const dealership3 = new Dealership()
        dealership3.title = 'My third Dealership'
        connection.orm.em.persist(dealership3)

        const user = new User()
        user.email = 'john.doe@acme.com'
        user.favoriteDealerships.add(dealership)
        user.favoriteDealerships.add(dealership2)
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        user2.favoriteDealerships.add(dealership)
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        initialCarData.forEach(carData => {
          const car = new Car()
          car.title = carData.title
          car.dealership = dealership
          car.owner = user

          connection.orm.em.persist(car)
        })

        await connection.orm.em.flush()
      })

      it('should return one dealership without populate', async () => {
        const result = await fetch(`/dealerships/${dealershipId}`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result.title).toBe('My first Dealership')

        expect(result.customers).toBeUndefined()
        expect(result.cars).toBeUndefined()

        //expect(result.customers).toHaveLength(2)
        //expect(result.cars).toHaveLength(3)
      })

      it('should return one dealership with populated cars', async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$populate=cars`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result.title).toBe('My first Dealership')
        expect(result.cars).toHaveLength(3)
        expect(result.cars[0].title).toBe('My first Car')
      })

      it('should return one dealership with populated cars and their owners', async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$populate=cars.owner`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result.title).toBe('My first Dealership')
        expect(result.cars).toHaveLength(3)
        expect(result.cars[0].title).toBe('My first Car')
        expect(result.cars[0].owner).toMatchObject({ email: 'john.doe@acme.com' })
      })

      it('should return a malformatted error when client trying to populate with unknown properties', async () => {
        await fetch(`/dealerships/${dealershipId}?$populate=shuttle`)
          .expect(400)
          .expect('content-type', 'application/json')
      })

      it('should return a malformatted error when client trying to subpopulate with unknown properties', async () => {
        await fetch(`/dealerships/${dealershipId}?$populate=cars.windows`)
          .expect(400)
          .expect('content-type', 'application/json')
      })
    })

    describe('- Fields selection', () => {
      let workshopId: string, dealershipId: string, carId: string

      const initialCarData = [
        { title: 'My first Car' },
        { title: 'My second Car' },
        { title: 'My last Car' }
      ]

      beforeAll(async () => {
        await connection.syncSchema()

        const workshop = new Workshop()
        workshop.title = 'My first Workshop'
        workshop.country = 'GERMANY'
        workshop.city = 'Berlin'

        workshopId = workshop.id

        connection.orm.em.persist(workshop)

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        const dealership2 = new Dealership()
        dealership2.title = 'My second Dealership'
        connection.orm.em.persist(dealership2)

        const dealership3 = new Dealership()
        dealership3.title = 'My third Dealership'
        connection.orm.em.persist(dealership3)

        const user = new User()
        user.email = 'john.doe@acme.com'
        user.favoriteDealerships.add(dealership)
        user.favoriteDealerships.add(dealership2)
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        user2.favoriteDealerships.add(dealership)
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        initialCarData.forEach((carData, index) => {
          const car = new Car()

          if (index === 0) carId = car.id

          car.title = carData.title
          car.dealership = dealership
          car.owner = user

          connection.orm.em.persist(car)
        })

        await connection.orm.em.flush()
      })

      it(`should only display workshop's title`, async () => {
        const result = await fetch(`/workshops/${workshopId}?$select=title`).expect(200).json()

        expect(result.country).toBeUndefined()
        expect(result.postalCode).toBeUndefined()
        expect(result.title).toBe('My first Workshop')
      })

      it(`should only display the two selected values`, async () => {
        const result = await fetch(`/workshops/${workshopId}?$select=country city`)
          .expect(200)
          .json()

        expect(result.country).toBe('GERMANY')
        expect(result.city).toBe('Berlin')
        expect(result.postalCode).toBeUndefined()
        expect(result.title).toBeUndefined()
      })

      it(`should only display selected values without populated props`, async () => {
        const result = await fetch(`/cars/${carId}?$select=title`).expect(200).json()

        expect(result.title).toBe('My first Car')
        expect(result.dealership).toBeUndefined()
      })

      it(`should only display selected values without collection populated props`, async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$select=title`).expect(200).json()

        expect(result.title).toBe('My first Dealership')
        expect(result.customers).toBeUndefined()
        expect(result.cars).toBeUndefined()
      })

      it('should return selected field on child when populating the collection', async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$select=cars.title&$populate=cars`)
          .expect(200)
          .json()

        expect(result.title).toBeUndefined()
        expect(result.cars[0].title).toBeDefined()
        expect(result.cars[0].doors).toBeUndefined()
      })

      it('should return selected fields on child & subchild when populating deeper collections', async () => {
        const result = await fetch(
          `/dealerships/${dealershipId}?$select=cars.title cars.owner.email&$populate=cars.owner`
        )
          .expect(200)
          .json()

        expect(result.title).toBeUndefined()

        expect(result.cars[0].title).toBeDefined()
        expect(result.cars[0].doors).toBeUndefined()

        expect(result.cars[0].owner.email).toBeDefined()
        expect(result.cars[0].owner.lastname).toBeUndefined()
      })

      it('should return an error when select field does not exist at parent level', async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$select=shuttle`)
          .expect(400)
          .json()

        expect(result.message).toBeDefined()
      })

      it('should return an error when select field does not exist at child level', async () => {
        const result = await fetch(`/dealerships/${dealershipId}?$select=cars.shuttle`)
          .expect(400)
          .json()

        expect(result.message).toBeDefined()
      })
    })

    describe('- Serialization', () => {
      let userId: string

      beforeAll(async () => {
        const user = new User()
        user.password = 'test123'
        user.email = 'john.doe.the.two@acme.com'

        userId = user.id

        await connection.orm.em.persistAndFlush(user)

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealership.customers.add(user)

        await connection.orm.em.persistAndFlush(dealership)
      })

      it(`should serialize a simple user, without his password`, async () => {
        const result = await fetch(`/users/${userId}`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result.email).toBe('john.doe.the.two@acme.com')
        expect(result.favoriteDealerships).toBeUndefined()
        expect(result.password).toBeUndefined()
      })
    })
  })

  /**
   * GET MANY
   */
  describe('GetMany', () => {
    const initialCarData = [
      { title: 'My first Car' },
      { title: 'My second Car' },
      { title: 'My last Car' }
    ]

    beforeAll(async () => {
      await connection.syncSchema()

      const dealership = new Dealership()
      dealership.title = 'My first Dealership'
      connection.orm.em.persist(dealership)

      const user = new User()
      user.email = 'john.doe@acme.com'
      connection.orm.em.persist(user)

      initialCarData.forEach(carData => {
        const car = new Car()
        car.title = carData.title
        car.dealership = dealership
        car.owner = user

        connection.orm.em.persist(car)
      })

      await connection.orm.em.flush()
    })

    describe('- Simple cases', () => {
      it('should return many car entities on /cars', async () => {
        const result = await fetch(`/cars`)
          .expect(200)
          .expect('content-type', 'application/json')
          .expect('x-total-count', '3')
          .json()

        expect(result).toHaveLength(3)

        initialCarData.forEach((data, index) => {
          expect(result[index].id).toBeDefined()
          expect(result[index].title).toBe(data.title)
        })
      })

      it('should return an empty array on /workshops', async () => {
        const result = await fetch(`/workshops`)
          .expect(200)
          .expect('content-type', 'application/json')
          .expect('x-total-count', 0)
          .json()

        expect(result).toHaveLength(0)
      })
    })

    describe('- Populating & sub-populating', () => {
      it('should return one dealership with populated cars', async () => {
        const result = await fetch(`/dealerships?$populate=cars`)
          .expect(200)
          .expect('content-type', 'application/json')
          .expect('x-total-count', 1)
          .json()

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('My first Dealership')
        expect(result[0].cars).toHaveLength(3)
        expect(result[0].cars[0].title).toBe('My first Car')
      })

      it('should return one dealership with populated cars and their owners', async () => {
        const result = await fetch(`/dealerships?$populate=cars.owner`)
          .expect(200)
          .expect('content-type', 'application/json')
          .expect('x-total-count', 1)
          .json()

        expect(result[0].title).toBe('My first Dealership')
        expect(result[0].cars).toHaveLength(3)
        expect(result[0].cars[0].title).toBe('My first Car')
        expect(result[0].cars[0].owner).toMatchObject({ email: 'john.doe@acme.com' })
      })

      it('should return a malformatted error when client trying to populate with unknown properties', async () => {
        await fetch(`/dealerships?$populate=shuttle`)
          .expect(400)
          .expect('content-type', 'application/json')
      })

      it('should return a malformatted error when client trying to subpopulate with unknown properties', async () => {
        await fetch(`/dealerships?$populate=cars.windows`)
          .expect(400)
          .expect('content-type', 'application/json')
      })
    })

    describe('- Populating on Many-to-Many', () => {
      let userId1: string, userId2: string

      beforeAll(async () => {
        await connection.syncSchema()

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        connection.orm.em.persist(dealership)

        const dealership2 = new Dealership()
        dealership2.title = 'My second Dealership'
        connection.orm.em.persist(dealership2)

        const dealership3 = new Dealership()
        dealership3.title = 'My third Dealership'
        connection.orm.em.persist(dealership3)

        const user = new User()
        user.email = 'john.doe@acme.com'
        user.favoriteDealerships.add(dealership)
        user.favoriteDealerships.add(dealership2)
        userId1 = user.id
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        user2.favoriteDealerships.add(dealership)
        userId2 = user2.id
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        initialCarData.forEach(carData => {
          const car = new Car()
          car.title = carData.title
          car.dealership = dealership
          car.owner = user

          connection.orm.em.persist(car)
        })

        await connection.orm.em.flush()
      })

      it('should return one dealership without populated customers', async () => {
        const result = await fetch(`/dealerships`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result[0].title).toBe('My first Dealership')

        expect(result[0].customers).not.toBeDefined()
        //expect(result[0].customers).toHaveLength(2)
        //expect(result[0].customers[0]).toBe(userId1)
      })

      it('should return one dealership with populated customers', async () => {
        const result = await fetch(`/dealerships?$populate=customers`)
          .expect(200)
          .expect('content-type', 'application/json')
          .json()

        expect(result[0].title).toBe('My first Dealership')
        expect(result[0].customers).toHaveLength(2)
        expect(result[0].customers[0].email).toBe('john.doe@acme.com')

        expect(result[0].cars).toBeUndefined()

        //expect(result[0].cars).toHaveLength(3)
        //expect(typeof result[0].cars[0]).toBe('string')
      })
    })

    describe('- Filtering', () => {
      let workshopId: string, dealershipId: string

      const initialCarData = [
        { title: 'My first Car', doors: 4 },
        { title: 'My second Car', doors: 4 },
        { title: 'My last Car', doors: 6 }
      ]

      beforeAll(async () => {
        await connection.syncSchema()

        const workshop = new Workshop()
        workshop.title = 'My first Workshop'
        workshop.country = 'GERMANY'
        workshop.city = 'Berlin'

        workshopId = workshop.id

        connection.orm.em.persist(workshop)

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        const dealership2 = new Dealership()
        dealership2.title = 'My second Dealership'
        connection.orm.em.persist(dealership2)

        const dealership3 = new Dealership()
        dealership3.title = 'My third Dealership'
        connection.orm.em.persist(dealership3)

        const user = new User()
        user.email = 'john.doe@acme.com'
        user.favoriteDealerships.add(dealership)
        user.favoriteDealerships.add(dealership2)
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        user2.favoriteDealerships.add(dealership)
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        initialCarData.forEach((carData, index) => {
          const car = new Car()

          car.title = carData.title
          car.dealership = dealership
          car.doors = carData.doors
          car.owner = user

          connection.orm.em.persist(car)
        })

        await connection.orm.em.flush()
      })

      it('should filter cars on one field', async () => {
        const filter = JSON.stringify({
          title: 'My first Car'
        })

        const result = await fetch(`/cars?$filter=${filter}`)
          .expect(200)
          .expect('x-total-count', 1)
          .json()

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('My first Car')
      })

      it('should filter cars with one other field (number)', async () => {
        const filter = JSON.stringify({
          doors: 4
        })

        const result = await fetch(`/cars?$filter=${filter}`)
          .expect(200)
          .expect('x-total-count', 2)
          .json()

        expect(result).toHaveLength(2)
      })

      it('should filter cars with two fields', async () => {
        const filter = JSON.stringify({
          title: 'My first Car',
          doors: 4
        })

        const result = await fetch(`/cars?$filter=${filter}`)
          .expect(200)
          .expect('x-total-count', 1)
          .json()

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('My first Car')
      })

      it('should filter cars with $or operator', async () => {
        const filter = JSON.stringify({
          $or: [
            {
              title: 'My first Car'
            },
            {
              doors: 6
            }
          ]
        })

        const result = await fetch(`/cars?$filter=${filter}`)
          .expect(200)
          .expect('x-total-count', 2)
          .json()

        expect(result).toHaveLength(2)
        expect(result[0].title).toBe('My first Car')
        expect(result[1].title).toBe('My last Car')
      })

      it('should filter cars with complex subquery', async () => {
        const filter = JSON.stringify({
          dealership: dealershipId,
          $or: [
            {
              title: 'My first Car'
            },
            {
              $and: [
                {
                  title: 'My last Car',
                  doors: 6
                }
              ]
            }
          ]
        })

        const result = await fetch(`/cars?$filter=${filter}`)
          .expect(200)
          .expect('x-total-count', 2)
          .json()

        expect(result).toHaveLength(2)
        expect(result[0].title).toBe('My first Car')
        expect(result[1].title).toBe('My last Car')
      })
    })

    describe('- Pagination', () => {
      beforeAll(async () => {
        await connection.syncSchema()

        for (let i = 0; i < 300; i++) {
          const car = new Car()

          car.title = faker.vehicle.model()
          car.doors = 4
          car.registeredAt = faker.date.past(2019)

          connection.orm.em.persist(car)
        }

        await connection.orm.em.flush()
      })

      it('should return the 10 first cars when limit is set', async () => {
        const result = await fetch(`/cars?$limit=10`)
          .expect(200)
          .expect('x-total-count', 300)
          .json()
        expect(result).toHaveLength(10)
      })

      it('should return maximum 100 cars at a time', async () => {
        const result = await fetch(`/cars?$limit=200`)
          .expect(200)
          .expect('x-total-count', 300)
          .json()
        expect(result).toHaveLength(100)
      })

      it('should return page 2 when offset is set', async () => {
        const resultPage1 = await fetch(`/cars`).expect(200).json()
        expect(resultPage1).toHaveLength(100)

        const resultPage2 = await fetch(`/cars?$offset=100`)
          .expect(200)
          .expect('x-total-count', 300)
          .json()
        expect(resultPage2).toHaveLength(100)

        expect(resultPage1).not.toBe(resultPage2)
      })

      it('should return no result when offset is over total count', async () => {
        const result = await fetch(`/cars?$offset=500`)
          .expect(200)
          .expect('x-total-count', 300)
          .json()
        expect(result).toHaveLength(0)
      })

      it('should return custom pagination when mixing limit & offset', async () => {
        const resultPage1 = await fetch(`/cars?$offset=0&$limit=20`)
          .expect('x-total-count', 300)
          .expect(200)
          .json()
        expect(resultPage1).toHaveLength(20)

        const resultPage2 = await fetch(`/cars?$offset=20&$limit=20`)
          .expect('x-total-count', 300)
          .expect(200)
          .json()
        expect(resultPage2).toHaveLength(20)

        expect(resultPage1).not.toBe(resultPage2)
      })
    })

    describe('- Ordering', () => {
      beforeAll(async () => {
        await connection.syncSchema()

        for (let i = 0; i < 300; i++) {
          const car = new Car()

          car.title = faker.vehicle.model()
          car.doors = 4
          car.registeredAt = faker.date.between(2015, new Date())

          connection.orm.em.persist(car)
        }

        await connection.orm.em.flush()
      })

      it('should return the 100 oldest cars', async () => {
        const result = await fetch(`/cars?$order=registeredAt`)
          .expect(200)
          .expect('x-total-count', 300)
          .json()
        expect(result).toHaveLength(100)

        let beforeDate = new Date(result[0].registeredAt).getTime()

        result.forEach((car: any) => {
          const currentDate = new Date(car.registeredAt).getTime()
          expect(beforeDate).toBeLessThanOrEqual(currentDate)
        })
      })
    })

    describe('- Query Schema Header', () => {
      let workshopId: string, dealershipId: string

      /**
       * This is the beginnings of the fetching SDK
       * @param query
       * @returns
       */
      function prepareHeader(query: any) {
        const buffer = Buffer.from(JSON.stringify(query), 'utf-8')
        const schemaHeader = buffer.toString('base64')

        return {
          'X-Query-schema': schemaHeader
        }
      }

      const initialCarData = [
        { title: 'My first Car', doors: 4 },
        { title: 'My second Car', doors: 4 },
        { title: 'My last Car', doors: 6 }
      ]

      beforeAll(async () => {
        await connection.syncSchema()

        const workshop = new Workshop()
        workshop.title = 'My first Workshop'
        workshop.country = 'GERMANY'
        workshop.city = 'Berlin'

        workshopId = workshop.id

        connection.orm.em.persist(workshop)

        const dealership = new Dealership()
        dealership.title = 'My first Dealership'
        dealershipId = dealership.id

        connection.orm.em.persist(dealership)

        const dealership2 = new Dealership()
        dealership2.title = 'My second Dealership'
        connection.orm.em.persist(dealership2)

        const dealership3 = new Dealership()
        dealership3.title = 'My third Dealership'
        connection.orm.em.persist(dealership3)

        const user = new User()
        user.email = 'john.doe@acme.com'
        user.favoriteDealerships.add(dealership)
        user.favoriteDealerships.add(dealership2)
        connection.orm.em.persist(user)

        const user2 = new User()
        user2.email = 'jane.doe@acme.com'
        user2.favoriteDealerships.add(dealership)
        connection.orm.em.persist(user2)

        const user3 = new User()
        user3.email = 'jane.doe@acme.com'
        connection.orm.em.persist(user3)

        initialCarData.forEach((carData, index) => {
          const car = new Car()

          car.title = carData.title
          car.dealership = dealership
          car.doors = carData.doors
          car.owner = user

          connection.orm.em.persist(car)
        })

        await connection.orm.em.flush()
      })

      it('should filter cars on one field', async () => {
        const $filter = {
          title: 'My first Car'
        }

        const headers = prepareHeader({ $filter })

        const result = await fetch(`/cars`, { headers }).expect(200).json()

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('My first Car')
      })

      it('should filter cars with one other field (number)', async () => {
        const $filter = {
          doors: 4
        }

        const headers = prepareHeader({ $filter })

        const result = await fetch(`/cars`, { headers }).expect(200).json()

        expect(result).toHaveLength(2)
      })

      it('should filter cars with two fields', async () => {
        const $filter = {
          title: 'My first Car',
          doors: 4
        }

        const headers = prepareHeader({ $filter })

        const result = await fetch(`/cars`, { headers }).expect(200).json()

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('My first Car')
      })

      it('should filter cars with $or operator', async () => {
        const $filter = {
          $or: [
            {
              title: 'My first Car'
            },
            {
              doors: 6
            }
          ]
        }

        const headers = prepareHeader({ $filter })

        const result = await fetch(`/cars`, { headers }).expect(200).json()

        expect(result).toHaveLength(2)
        expect(result[0].title).toBe('My first Car')
        expect(result[1].title).toBe('My last Car')
      })

      it('should filter cars with complex subquery', async () => {
        const $filter = {
          dealership: dealershipId,
          $or: [
            {
              title: 'My first Car'
            },
            {
              $and: [
                {
                  title: 'My last Car',
                  doors: 6
                }
              ]
            }
          ]
        }

        const headers = prepareHeader({ $filter })

        const result = await fetch(`/cars`, { headers }).expect(200).json()

        expect(result).toHaveLength(2)
        expect(result[0].title).toBe('My first Car')
        expect(result[1].title).toBe('My last Car')
      })
    })

    describe('- Middlewares', () => {
      beforeAll(async () => {
        await connection.syncSchema()

        const profile = new Profile()

        profile.private = true

        connection.orm.em.persist(profile)

        await connection.orm.em.flush()
      })
    })
  })
})
