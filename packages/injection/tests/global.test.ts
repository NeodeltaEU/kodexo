import { importFiles } from '../src/utils/importers'

describe('Global', () => {
  it('should true to be true', () => {
    expect(true).toBe(true)
  })
})

describe('Import files', () => {
  it('should import symbols from glob', async () => {
    const symbols = await importFiles('tests/mocks/*.controller.ts')

    expect(symbols.length).toBe(2)
    expect(symbols[0].name).toBe('CarController')
  })
})
