import { Car } from './mocks/entities/Car'

describe('Entity', () => {
  describe('When we create an entity', () => {
    it('should have values defined', () => {
      const car = new Car({})
    })
  })
})
