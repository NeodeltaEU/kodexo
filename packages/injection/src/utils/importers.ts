import { Class } from 'type-fest'
import { sync } from 'globby'
import { cleanGlobPatterns, isArray } from './cleanGlobPatterns'
import { Provider, providerRegistry, ProviderType } from '../main'
import { IProvider } from '../interfaces/IProvider'

/**
 *
 */
export async function importProviders(imports: any): Promise<IProvider[]> {
  const providers = await importComponents(imports)
  const children = await importRecursive(providers)
  return [...children, ...providers]
}

/**
 *
 */
export async function importRecursive(providers: any[]): Promise<IProvider[]> {
  const promises = providers
    .reduce((result, { token }) => {
      const provider = providerRegistry.get(token)

      if (provider?.type !== ProviderType.MODULE) return result

      result.push(provider)

      return result
    }, [])
    .map(async (provider: Provider) => {
      const imports = await importProviders(provider.imports)
      const routing = await importProviders((provider as any).routing)
      const queues = await importProviders((provider as any).queues)

      return [...imports, ...routing, ...queues]
    })

  return concat(await Promise.all(promises))
}

/**
 *
 */
export async function importFiles(
  patterns: string | string[],
  exclude: string[] = []
): Promise<any[]> {
  const files = sync(cleanGlobPatterns(patterns, exclude))

  const symbols: any[] = []

  for (const file of files) {
    try {
      const exports = await import(file)
      Object.keys(exports).forEach(key => symbols.push(exports[key]))
    } catch (err) {
      console.log(err)
      /* istanbul ignore next */
      //process.exit(-1)
    }
  }

  return symbols
}

/**
 *
 */
async function importComponents(imports: any) {
  if (!imports) return []

  if (!isArray(imports)) {
    imports = Object.keys(imports).map(key => {
      return {
        values: concat(imports[key]),
        route: key
      }
    })
  } else {
    imports = imports.map(importItem => {
      return {
        values: concat(importItem)
      }
    })
  }

  const promises: Promise<IProvider>[] = []

  for (const importItem of imports) {
    promises.push(
      ...importItem.values.map(async (value: any) => {
        const symbols = await resolveSymbols(value)

        return symbols
          .filter(symbol => isClass(symbol))
          .map(symbol => {
            return {
              token: symbol,
              route: importItem.route
            } as IProvider
          })
      })
    )
  }

  return concat(await Promise.all(promises))
}

/**
 *
 */
async function resolveSymbols(item: any) {
  const symbols = []

  if (isClass(item)) symbols.push(item)
  else {
    const imported = await importFiles(item)
    symbols.push(...imported)
  }

  return symbols
}

/**
 *
 */
function isClass(target: any) {
  if (!target) return false
  return target === target?.prototype?.constructor
}

/**
 *
 */
function concat(arr: any): IProvider[] {
  return isArray(arr) ? [].concat(...arr) : [].concat(arr)
}
