export * from './components'

declare global {
  namespace Kodexo {
    interface Configuration {
      trpc: {
        appRouter: any // TODO: Classe abstraite
        createContext: (...context: any[]) => any
      }
    }
  }
}
