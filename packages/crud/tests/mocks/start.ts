import { App } from '../../../app/src'
import { Server } from './Server'

async function bootstrap() {
  await App.bootstrap(Server)
}

bootstrap()
