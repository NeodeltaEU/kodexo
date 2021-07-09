import { resolve, join } from 'path'
const fixPath = require('normalize-path')

export function isArray<T = any>(target: unknown): target is T[] {
  return Array.isArray(target)
}

export function isString(target: any): target is string {
  return typeof target === 'string' || target instanceof String || target === String
}

export function normalizePath(item: any, ...paths: string[]): any {
  if (isString(item)) {
    const path = join(item, ...paths)
    return fixPath(path)
  }

  if (isArray(item)) {
    return item.map((item: any) => normalizePath(item))
  }

  return item
}

function isTsEnv() {
  return (
    (require && require.extensions && require.extensions['.ts']) ||
    process.env['TS_TEST'] ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.env.NODE_ENV === 'test'
  )
}

function mapExcludes(excludes: string[]) {
  return excludes.map((s: string) => `!${s.replace(/!/gi, '')}`)
}

function mapExtensions(file: string): string {
  if (!isTsEnv()) {
    file = file.replace(/\.ts$/i, '.js')
  }

  return file
}

export function cleanGlobPatterns(files: string | string[], excludes: string[]): string[] {
  return []
    .concat(files as never)
    .map((s: string) => resolve(s))
    .concat(mapExcludes(excludes) as never)
    .map(mapExtensions)
    .map((s: string) => normalizePath(s)) //normalize path
}
