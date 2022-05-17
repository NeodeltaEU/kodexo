export function cleanObject(obj: any) {
  let newObj: any = {}

  Object.keys(obj).forEach(key => {
    if (obj[key] === Object(obj[key])) newObj[key] = cleanObject(obj[key])
    else if (obj[key] !== undefined) newObj[key] = obj[key]
  })

  return newObj
}
