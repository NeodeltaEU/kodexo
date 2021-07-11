export async function pMap(
  iterable: any[],
  mapper: (element: any, index?: number) => Promise<any>,
  options: Partial<pMapOptions> = {}
) {
  return new Promise((resolve, reject) => {
    if (typeof mapper !== 'function') throw new TypeError('Mapper function is required')

    const concurrency = options.concurrency || Number.POSITIVE_INFINITY

    const result: any[] = []
    const iterator = iterable[Symbol.iterator]()
    let isRejected = false
    let isIterableDone = false
    let resolvingCount = 0
    let currentIndex = 0

    const next = () => {
      if (isRejected) return

      const nextItem = iterator.next()
      const index = currentIndex
      currentIndex++

      if (nextItem.done) {
        isIterableDone = true

        if (resolvingCount === 0) {
          resolve(result)
        }

        return
      }

      resolvingCount++
      ;(async () => {
        try {
          const element = await nextItem.value

          if (isRejected) return

          const value = await mapper(element, index)

          result[index] = value

          resolvingCount--
          next()
        } catch (error) {
          isRejected = true
          reject(error)
        }
      })()
    }

    for (let index = 0; index < concurrency; index++) {
      next()

      if (isIterableDone) break
    }
  })
}

type pMapOptions = {
  concurrency: number
}
