import { EntityRepository } from '@mikro-orm/core'
import { isObject } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { ConnectionDatabase } from '@neatsio/mikro-orm'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Class } from 'type-fest'

interface ExistsValidationArguments<E> extends ValidationArguments {
  constraints: [Class<E>]
}

@ValidatorConstraint({ name: 'isExist', async: true })
class Exists implements ValidatorConstraintInterface {
  @Inject private connection: ConnectionDatabase

  async validate<E>(
    value: any,
    validationArguments: ExistsValidationArguments<E>
  ): Promise<boolean> {
    const { property, constraints = [] } = validationArguments

    const [entityClass] = constraints

    if (!entityClass) throw new Error('A class must be passed as parameter for Exists Validator')

    const repo = this.connection.orm.em.getRepository(entityClass) as EntityRepository<E>

    const id: any = isObject(value) ? value?.id : value

    const whereConditions = {
      id
    }

    const results = await repo.count(whereConditions as any)

    return results >= 1
  }

  defaultMessage() {
    return 'specified id not exist or not available for this context'
  }
}

export function IsExist(token: Class, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isExist',
      target: object.constructor,
      propertyName,
      constraints: [token],
      options: validationOptions,
      validator: Exists
    })
  }
}
