import { sync } from 'globby'
import { cleanGlobPatterns } from './cleanGlobPatterns'

export async function importFiles(
  patterns: string | string[],
  exclude: string[] = []
): Promise<any[]> {
  const files = sync(cleanGlobPatterns(patterns, exclude))
  const promises = []

  for (const file of files) {
    try {
      const importPromise = import(file).then(exports =>
        Object.keys(exports).forEach(key => exports[key])
      )

      promises.push(importPromise)
    } catch (err) {
      console.log(err)
      /* istanbul ignore next */
      process.exit(-1)
    }
  }

  return Promise.all(promises)
}
