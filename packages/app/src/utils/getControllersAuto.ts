import * as Path from 'path'

export function controllersAutoDiscovery() {
  return {
    '/': [Path.resolve(process.cwd() + '/src/features/**/*.controller.{ts,js}')]
  }
}
