import {
  AnyEntity,
  Collection,
  EntityMetadata,
  EntityRepository,
  NotFoundError,
  ReferenceType,
  ValidationError
} from '@mikro-orm/core'
import { pMap } from '@uminily/common'
import { HttpError } from '@uminily/errors'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'
import { Except } from 'type-fest'
import { Class } from 'type-fest'
import { QueryParsedResult } from './QueryParser'

/**
 *
 */
export abstract class CrudService<E extends AnyEntity> {
  protected readonly repository: EntityRepository<E>
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
    let { populate, fields, filter, limit, offset, orderBy } = queryParams

    try {
      const [entities, count] = await this.repository.findAndCount(filter, {
        populate: populate as any,
        fields,
        limit,
        offset,
        orderBy
      })

      return {
        entities, //this.applyCollectionsIdentifiersForEntity(entities, { selectedFields: fields }),
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

    this.connection.orm.em.clear()

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
    const filterQuery: any = {
      id
    }

    try {
      const entity: any = await this.repository.findOneOrFail(filterQuery)

      await this.repository.removeAndFlush(entity)

      return {
        id,
        deletedAt: new Date()
      }
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw HttpError.NotFound()
      }

      /* istanbul ignore next */
      throw err
    }
  }

  /**
   *
   */
  async retrieve(id: any, options: any = {}): Promise<E> {
    let { populate, fields, identifiers = true } = options

    try {
      // TODO: when select subchild property, include relation-key in field, unless hydration wont work

      const entity = await this.repository.findOneOrFail(id, {
        populate,
        fields
      })

      return entity

      /*return identifiers
        ? this.applyCollectionsIdentifiersForEntity(entity, { selectedFields: fields })
        : entity*/
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
  'limit' | 'offset' | 'orderBy' | 'filter'
>

type CrudServiceOptions = {
  collectionIdentifierFields: { [key: string]: string }
}
