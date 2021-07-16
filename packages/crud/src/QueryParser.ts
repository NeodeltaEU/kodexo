import { EntityMetadata } from '@mikro-orm/core'
import { isObject, Request } from '@uminily/common'
import { HttpError } from '@uminily/errors'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase } from '@uminily/mikro-orm'

const authorizedOperators: { [key: string]: string } = {
  $eq: '$eq',
  $gt: '$gt',
  $gte: '$gte',
  $in: '$in',
  $lt: '$lt',
  $lte: '$lte',
  $ne: '$ne',
  $nin: '$nin',
  $like: '$like',
  $ilike: '$ilike',
  //$overlap: '$overlap',
  //$contains: '$contains',
  $and: '$and',
  $not: '$not',
  $or: '$or'
}

export class QueryParser {
  @Inject private connection: ConnectionDatabase

  private populate?: string[]
  private fields?: string[]
  private filter: any = {}
  private orderBy: any
  private limit: number = 100
  private offset?: number

  private currentEntityMetadata: EntityMetadata

  constructor(req: Request, fromBody = false, private currentEntity?: string) {
    this.setCurrentEntityMetadata()

    const rawQuery: any = fromBody ? req.body : req.query

    this.parsePopulate(rawQuery.$populate)
    this.parseSelect(rawQuery.$select)
    this.parseFilter(rawQuery.$filter)
    this.parseLimit(rawQuery.$limit)
    this.parseOffset(rawQuery.$offset)
    this.parseOrder(rawQuery.$order)
  }

  /**
   *
   */
  private setCurrentEntityMetadata() {
    const currentEntityMetadata = this.connection.entitiesMetadata.find(
      entityMetadata => entityMetadata.name === this.currentEntity
    )

    if (!currentEntityMetadata) throw new Error('Current entity not found with this connection')

    this.currentEntityMetadata = currentEntityMetadata
  }

  /**
   *
   */
  private parsePopulate(rawPopulate: any) {
    if (!rawPopulate) return

    const splitted: string[] = rawPopulate.split(' ')

    const isRelationPathValid = (parent: EntityMetadata, path: string): boolean => {
      const [currentLevel, ...nextLevel] = path.split('.')

      const relationFound = parent.relations.find(relation => relation.name === currentLevel)

      if (!relationFound || !relationFound.targetMeta) return false

      if (nextLevel.length)
        return isRelationPathValid(relationFound.targetMeta, nextLevel.join('.'))

      return true
    }

    splitted.forEach(populatePath => {
      if (!isRelationPathValid(this.currentEntityMetadata, populatePath))
        throw HttpError.BadRequest({ message: `Unauthorized populate path at '${populatePath}'` })
    })

    this.populate = splitted
  }

  /**
   *
   * @param rawSelect
   */
  private parseSelect(rawSelect: any) {
    if (!rawSelect) return

    const splitted: string[] = rawSelect.split(' ')
    const mustBeAddedForForeignKeys: string[] = []

    let currentPathReading: string[] = []

    const isRelationPathAndPropertiesValid = (parent: EntityMetadata, path: string): boolean => {
      const [currentLevel, ...nextLevel] = path.split('.')

      if (!nextLevel.length) {
        return Object.keys(parent.properties).includes(currentLevel)
      }

      currentPathReading.push(currentLevel)

      const relationFound = parent.relations.find(relation => relation.name === currentLevel)

      if (!relationFound || !relationFound.targetMeta) return false

      if (relationFound.reference === '1:m') currentPathReading.push(relationFound.mappedBy)

      if (mustBeAddedForForeignKeys.includes(currentPathReading.join('.'))) {
        currentPathReading.pop()
      }

      return isRelationPathAndPropertiesValid(relationFound.targetMeta, nextLevel.join('.'))
    }

    splitted.forEach(selectPath => {
      currentPathReading = []

      if (!isRelationPathAndPropertiesValid(this.currentEntityMetadata, selectPath))
        throw HttpError.BadRequest({ message: `Unauthorized select path at '${selectPath}'` })

      if (currentPathReading.length) mustBeAddedForForeignKeys.push(currentPathReading.join('.'))
    })

    this.fields = [...splitted, ...mustBeAddedForForeignKeys]
  }

  /**
   *
   * @param rawFilter
   */
  private parseFilter(rawFilter: any) {
    if (!rawFilter) return

    let filterPlainObjectParsed

    try {
      filterPlainObjectParsed = JSON.parse(rawFilter)
    } catch (err) {
      throw HttpError.BadRequest(`Malformed JSON Filter`)
    }

    // TODO: test all fields if there are in metadata entity properties

    const convertRecursive = (currentFilterLevel: any): any => {
      if (Array.isArray(currentFilterLevel)) return currentFilterLevel.map(convertRecursive)
      if (isObject(currentFilterLevel)) return currentFilterLevel

      const converted = Object.keys(currentFilterLevel).reduce((result: any, prop: string) => {
        if (prop.startsWith('$') && !authorizedOperators.hasOwnProperty(prop))
          throw HttpError.BadRequest(`Filter operator not authorized`)

        const key = authorizedOperators[prop] || prop
        const value = currentFilterLevel[prop]

        if (value === undefined) throw HttpError.BadRequest(`Filter value must not be undefined`)

        if (value === null) {
          result[key] = null
          return result
        }

        result[key] = convertRecursive(value)

        return result
      }, {})

      return converted
    }

    this.filter = convertRecursive(filterPlainObjectParsed)
  }

  /**
   *
   * @param rawLimit
   */
  private parseLimit(rawLimit: any) {
    if (!rawLimit) return
    this.limit = parseInt(rawLimit, 10)

    if (this.limit > 100) this.limit = 100
  }

  /**
   *
   * @param rawOffset
   * @returns
   */
  private parseOffset(rawOffset: any) {
    if (!rawOffset) return
    this.offset = parseInt(rawOffset, 10)
  }

  /**
   *
   * @param rawOrder
   */
  private parseOrder(rawOrder: any) {
    if (!rawOrder) return

    const fields = rawOrder ? rawOrder.split(' ') : []

    // TODO: test all fields if there are in metadata entity properties

    this.orderBy = fields.reduce((result: any, field: string) => {
      const order = field.startsWith('-') ? 'DESC' : 'ASC'

      result[field] = order

      return result
    }, {})
  }

  /**
   *
   * @returns
   */
  private render(): QueryParsedResult {
    const { populate, fields, filter, limit, offset, orderBy } = this

    return {
      filter,
      fields,
      populate,
      orderBy,
      limit,
      offset
    }
  }

  /**
   *
   * @param req
   * @returns
   */
  static parse(req: Request, currentEntity?: string) {
    // TODO: Not Good, go via Store & Reflect metadata
    const fromBody = req.method === 'POST' && req.path.includes('filter')

    const queryParser = new QueryParser(req, fromBody, currentEntity)

    return queryParser.render()
  }
}

export type QueryParsedResult = {
  filter: any
  fields?: string[]
  orderBy?: string
  limit: number
  offset?: number
  populate?: Array<string>
}
