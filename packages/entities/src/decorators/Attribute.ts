export function Attribute() {
  return function (target: any, key: string) {
    delete target[key]

    const getter = function (this: any) {
      const currentValue = this.get(key)
      return currentValue
    }

    const setter = function (this: any, newValue: any) {
      this.set(key, newValue)
    }

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    })
  }
}
