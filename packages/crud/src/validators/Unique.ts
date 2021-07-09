import { EntityRepository } from '@mikro-orm/core'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Class } from 'type-fest'
import { Inject } from '../../../injection/src'
import { ConnectionDatabase } from '@uminily/mikro-orm'
import { REQUEST_CONTEXT } from '../constants'

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [Class<E>]
}

@ValidatorConstraint({ name: 'isUnique', async: true })
class Unique implements ValidatorConstraintInterface {
  @Inject private connection: ConnectionDatabase

  async validate<E>(
    value: any,
    validationArguments: UniqueValidationArguments<E>
  ): Promise<boolean> {
    const { property, constraints = [] } = validationArguments

    const [entityClass] = constraints

    if (!entityClass) throw new Error('A class must be passed as parameter for Unique Validator')

    const repo = this.connection.orm.em.getRepository(entityClass) as EntityRepository<E>

    const { id }: any = (validationArguments.object as any)[REQUEST_CONTEXT]

    const whereConditions: any = { [property]: value }
    if (id) whereConditions.id = { $ne: id }

    const results = await repo.count(whereConditions)

    return results === 0
  }

  defaultMessage() {
    return 'specified id already exit or not available for this context'
  }
}

export function IsUnique(token: Class, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      constraints: [token],
      options: validationOptions,
      validator: Unique
    })
  }
}
