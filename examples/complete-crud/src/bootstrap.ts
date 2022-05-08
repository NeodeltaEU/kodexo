import { App } from '@kodexo/app'
import { Server } from './server'

async function bootstrap() {
  return App.bootstrap(Server)
}

bootstrap()
