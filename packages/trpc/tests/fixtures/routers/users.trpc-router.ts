import { Inject } from '@kodexo/injection'
import { TRPCService } from '../../../src/components/trpc.service'
import { TRPCRouter } from '../../../src/decorators/TRPCRouter'
import { UsersService } from '../users.service'

@TRPCRouter()
export class UsersTRPCRouter {
  public router = TRPCService.t.router({
    greeting: TRPCService.t.procedure.query(this.greeting),
    onche: TRPCService.t.procedure.input(this.oncheValidation).query(req => this.onche(req.input))
  })

  constructor(@Inject private service: UsersService) {}

  greeting(): string {
    return 'onche'
  }

  async onche(input: number) {
    return {
      obj: true,
      onche: await this.service.onche()
    }
  }

  oncheValidation(val: unknown) {
    if (typeof val === 'number') return val
    throw new Error(`Invalid input: ${typeof val}`)
  }
}
