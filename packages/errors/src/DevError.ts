export class DevError extends Error {
  constructor(public message: string, stack = true, public context?: any) {
    super(message)

    if (!stack) this.stack = undefined
  }
}
