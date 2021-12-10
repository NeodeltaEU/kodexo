export * from './components'
export * from './decorators'
export * from './interfaces'
export * from './main'

declare global {
  namespace Kodexo {
    interface Configuration {
      upload: {
        mainFolder: string
        providers: {
          s3: {
            bucket: string
            cdn: {
              enabled: boolean
              endpoint: string
            }
            credentials: {
              accessKeyId: string
              secretAccessKey: string
              endpoint: string
              region: string
            }
          }
        }
      }
    }
  }
}
