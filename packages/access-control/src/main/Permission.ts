import { Condition } from '../interfaces/Condition'
import { EqualsCondition } from './conditions/EqualsCondition'

export class Permission {
  constructor(
    public readonly action: string,
    public readonly resource: string,
    public allowed: boolean = true,
    public attributes: string[] = ['*'],
    public condition?: Condition
  ) {}

  /**
   *
   * @param args
   * @returns
   */
  testCondition(context: { [key: string]: any }): boolean {
    if (!this.condition) return true

    const { fn, args } = this.condition

    switch (fn) {
      case 'EQUALS':
        return new EqualsCondition().evaluate(args, context)
    }

    return true
  }
}
