import { App } from '@kodexo/app'
import { Server } from './Server'

async function bootstrap() {
  await App.bootstrap(Server)
}

bootstrap()
