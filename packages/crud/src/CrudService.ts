import { pMap, Request } from '@kodexo/common'
import { HttpError } from '@kodexo/errors'
import { Store } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'
import {
  AnyEntity,
  Collection,
  EntityMetadata,
  EntityProperty,
  EntityRepository,
  FindOptions,
  NotFoundError,
  ReferenceType,
  ValidationError
} from '@mikro-orm/core'
import { Class, Except } from 'type-fest'
import { QueryParsedResult } from './interfaces'

/**
 *
 */
export abstract class CrudService<E extends AnyEntity> {
  public readonly repository: EntityRepository<E>
  protected readonly entityMetadata: EntityMetadata
  protected readonly collectionFields: string[]
  protected readonly entityProperties: string[]

  public readonly entityName?: string

  constructor(
    protected connection: ConnectionDatabase,
    protected token: Class<E>,
    protected options?: CrudServiceOptions
  ) {
    this.repository = RepositoryBuilder.fromOptions(connection, token) as EntityRepository<E>

    this.entityMetadata = (new this.token() as AnyEntity).__helper!.__meta

    this.entityProperties = Object.keys(this.entityMetadata.properties)

    this.collectionFields = this.entityMetadata.relations
      .filter(
        ({ reference }) =>
          reference === ReferenceType.ONE_TO_MANY || reference === ReferenceType.MANY_TO_MANY
      )
      .map(({ name }) => name)

    this.entityName = this.entityMetadata.name
  }

  /**
   *
   */
  protected removeCache() {
    this.connection.orm.em.clear()
  }

  /**
   *
   */
  async save() {
    await this.repository.flush()
  }

  /**
   *
   * @param id
   * @returns
   */
  async getOne(id: any, queryParams?: QueryParsedResultForOneResult) {
    try {
      return this.retrieve(id, queryParams)
    } catch (err) {
      if (err instanceof NotFoundError) throw HttpError.NotFound()

      if (err instanceof ValidationError || err instanceof TypeError) {
        throw HttpError.BadRequest({
          message: `Your query is malformed, please check populate & filters then try again.`
        })
      }

      /* istanbul ignore next */
      throw err
    }
  }

  /**
   *
   * @returns
   */
  async getMany(queryParams: QueryParsedResult) {
    let { populate, fields, filter = {}, deleted, limit, offset, orderBy, req } = queryParams

    this.removeCache()

    if (populate) await this.populateChecking(populate, req)

    const findParams: FindOptions<E> = {
      populate: populate as any,
      fields,
      limit,
      offset,
      orderBy
    }

    if (deleted !== 'false') {
      const isDeleted = deleted === 'all' ? null : true

      findParams.filters = {
        softDelete: {
          isDeleted
        }
      }
    }

    try {
      const [entities, count] = await this.repository.findAndCount(filter, findParams)

      return {
        entities: this.applyCollectionsIdentifiersForEntity(entities, { selectedFields: fields }),
        count
      }
    } catch (err) {
      if (err instanceof ValidationError || err instanceof TypeError) {
        throw HttpError.BadRequest({
          message: `Your query is malformed, please check populate & filters then try again.`
        })
      }

      /* istanbul ignore next */
      throw err
    }
  }

  /**
   *
   */
  async createOne(dto: any, queryParams: QueryParsedResultForOneResult) {
    const createdEntity: any = this.repository.create(dto)
    this.repository.persist(createdEntity)
    await this.save()

    this.removeCache()

    return this.retrieve(createdEntity.id, queryParams)
  }

  /**
   *
   */
  async updateOne(id: any, dto: any, queryParams: QueryParsedResultForOneResult) {
    const entity = await this.retrieve(id, { identifiers: false })

    const initCollectionPromises: any[] = this.collectionFields
      .filter(field => dto.hasOwnProperty(field))
      .map(field => (entity[field] as Collection<E>).init())

    // Doing that before assign, to let MikroORM do his job with collection removal/addings
    await Promise.all(initCollectionPromises)

    this.repository.assign(entity, dto)

    await this.save()

    return this.retrieve(id, queryParams)
  }

  /**
   *
   * @param id
   */
  async deleteOne(id: any) {
    try {
      const entity = await this.repository.findOneOrFail(id)

      if (this.entityProperties.includes(this.options?.deletedAtField || 'deletedAt')) {
        await this.repository.nativeUpdate(
          { id } as any,
          {
            [this.options?.deletedAtField || 'deletedAt']: new Date()
          } as any
        )
      } else {
        await this.repository.removeAndFlush(entity)
      }
    } catch (err) {
      throw HttpError.NotFound()
    }

    return {
      id,
      deletedAt: new Date()
    }
  }

  /**
   *
   * @param populate
   */
  private async populateChecking(populate: string[], req?: Request) {
    // FIXME: this is a hack for coding simplicity, but it's not the best way to do it
    if (!req) return true

    const canPopulate = async (
      fields: string[],
      currentEntity: Class<any>,
      relations: EntityProperty<any>[],
      currentIndex: number = 0
    ): Promise<boolean> => {
      if (currentIndex === fields.length) return true

      const callback = Store.from(currentEntity, fields[currentIndex]).get('limitPopulate')

      if (callback) {
        const isValid = await callback(req)
        if (!isValid) throw new Error('Invalid populate')
      }

      const nextRelation = relations.find(relation => relation.name === fields[currentIndex])

      if (!nextRelation) return false

      const { targetMeta } = nextRelation

      return canPopulate(
        fields,
        targetMeta?.class as any,
        targetMeta?.relations || [],
        currentIndex + 1
      )
    }

    await pMap(populate, async (populateChain: string) => {
      const fields = populateChain.split('.')

      try {
        await canPopulate(fields, this.entityMetadata.class, this.entityMetadata.relations)
      } catch (err) {
        throw HttpError.Unauthorized({ message: 'You are not allowed to populate this field' })
      }
    })
  }

  /**
   *
   */
  async retrieve(id: any, options: any = {}): Promise<E> {
    let { populate, fields, req, filter = {}, identifiers = true } = options

    if (populate) await this.populateChecking(populate, req)

    const filterQuery: any = {
      ...filter,
      id
    }

    this.removeCache()

    try {
      // TODO: when select subchild property, include relation-key in field, unless hydration wont work

      const entity = await this.repository.findOneOrFail(filterQuery, {
        populate,
        fields
      })

      //return entity

      return identifiers
        ? this.applyCollectionsIdentifiersForEntity(entity, { selectedFields: fields })
        : entity
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw HttpError.NotFound()
      }

      throw err
    }
  }

  /**
   *
   * @param entity
   * @returns
   */
  async applyCollectionsIdentifiersForEntity(
    entityOrEntities: E | E[],
    options: applyCollectionIdentifierForEntityOptions = {}
  ) {
    const { selectedFields } = options

    const targetFields = selectedFields?.length
      ? selectedFields.filter((field: string) => {
          // TODO: WE NEED TO HANDLE MULTIPLE LEVEL AND APPLY THIS BELOW
          const [firstLevel] = field.split('.')

          return this.collectionFields.includes(firstLevel as string)
        })
      : this.collectionFields

    const applyForOneEntity = async (entity: E) => {
      const plainValue = entity.toJSON()

      await pMap(targetFields, async (field: string) => {
        // TODO: WE NEED TO HANDLE MULTIPLE LEVEL AND APPLY THIS BELOW
        const [firstLevel] = field.split('.')

        const collection = entity[firstLevel] as Collection<E>

        if (collection.isInitialized()) return

        await collection.init()

        let identifierField

        if (this.options?.collectionIdentifierFields.hasOwnProperty(firstLevel)) {
          identifierField = this.options.collectionIdentifierFields[firstLevel]
        }

        plainValue[firstLevel] = collection.getIdentifiers(identifierField)
      })

      return plainValue
    }

    if (Array.isArray(entityOrEntities)) return pMap(entityOrEntities, applyForOneEntity)
    return applyForOneEntity(entityOrEntities)
  }
}

type applyCollectionIdentifierForEntityOptions = {
  selectedFields?: string[]
}

type QueryParsedResultForOneResult = Except<
  QueryParsedResult,
  'limit' | 'offset' | 'orderBy' | 'deleted'
>

type CrudServiceOptions = {
  collectionIdentifierFields: { [key: string]: string }
  deletedAtField?: string
}
