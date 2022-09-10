import { TRPCService } from '../../../src/components/trpc.service'

export const usersTRPCRouter = TRPCService.t.router({
  greeting: TRPCService.t.procedure.query(() => 'hello tRPC v10!')
})
