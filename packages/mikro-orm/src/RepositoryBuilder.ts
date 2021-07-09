import { Class } from 'type-fest'
import { ConnectionDatabase } from './ConnectionDatabase'

export class RepositoryBuilder {
  private model: any

  constructor(private connection: ConnectionDatabase) {}

  /**
   *
   */
  forModel(model: any) {
    this.model = model
    return this
  }

  /**
   *
   */
  getRepository<T>() {
    return this.connection.orm.em.getRepository<T>(this.model)
  }

  /**
   *
   * @param connection
   * @returns
   */
  static fromOptions<T>(connection: ConnectionDatabase, model: Class<T>) {
    return new RepositoryBuilder(connection).forModel(model).getRepository<T>()
  }
}
