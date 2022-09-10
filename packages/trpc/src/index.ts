import { AnyRouter } from '@trpc/server'

export * from './components'

declare global {
  namespace Kodexo {
    interface Configuration {
      trpc: {
        appRouter: AnyRouter
        createContext: (...context: any[]) => any
      }
    }
  }
}
