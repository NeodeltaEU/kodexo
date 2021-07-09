import { Collection, Entity, Attribute, Optional } from '../../../src'

@Collection
export class Car extends Entity<CarAttributes, CarBackCreationAttributes, CarFrontAttributes> {
  @Attribute()
  model: string
}

interface CarAttributes {
  id: string
  model: string
  backOnly: boolean
}

interface CarBackCreationAttributes extends Optional<CarAttributes, 'id' | 'model'> {}
interface CarFrontAttributes extends Omit<CarBackCreationAttributes, 'backOnly'> {}
