import { Store } from '@neatsio/injection'

export abstract class Entity<T extends {} = any, U extends {} = T, V extends {} = T> {
  //[key: string]: any

  public id: number

  protected dataValues: any = {}

  protected store: Store

  constructor(values?: T | U | V) {
    this.initValues(values)
  }

  /**
   *
   * @param values
   */
  private initValues(values?: any) {
    values = { ...values }

    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value)
    })
  }

  /**
   *
   */
  public set(key: string, value: any) {
    this.dataValues[key] = value
  }

  /**
   *
   */
  public get(key: string) {
    return this.dataValues[key]
  }
}
