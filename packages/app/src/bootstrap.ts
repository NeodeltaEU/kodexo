import * as PrettyError from 'pretty-error'
import { Class } from 'type-fest'
import { App } from '.'
import { ServerHooks } from './interfaces'

const pe = new PrettyError()

export async function boot(server: Class<ServerHooks>, errorHandler?: HandlingServerError) {
  return App.bootstrap(server).catch((err: any) => {
    console.error(pe.render(err))

    if (errorHandler) errorHandler(err)
  })
}

export type HandlingServerError = (err: Error) => void
