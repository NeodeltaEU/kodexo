export function cleanObject(obj: any, mutate = false, recursive: Number | Boolean = 0) {
  const returnObj: any = {}

  Object.entries(obj).forEach(([key, val]) => {
    if (val === undefined) {
      if (mutate) delete obj[key]
    } else {
      let recursiveVal

      if (recursive > 0 && val !== null && typeof val === 'object') {
        recursiveVal = cleanObject(
          val,
          mutate,
          typeof recursive === 'number' ? recursive - 1 : true
        )
      }

      if (!mutate) returnObj[key] = recursiveVal || val
    }
  })

  return mutate ? obj : returnObj
}
