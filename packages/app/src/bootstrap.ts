import * as PrettyError from 'pretty-error'
import { Class } from 'type-fest'
import { App } from '.'
import { ServerHooks } from './interfaces'

const pe = new PrettyError()

export async function boot(server: Class<ServerHooks>) {
  try {
    return await App.bootstrap(server)
  } catch (err: any) {
    console.error(pe.render(err))
  }
}
