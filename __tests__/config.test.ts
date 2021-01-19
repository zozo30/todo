const readFileSync = jest.fn()
jest.mock('fs', () => ({ readFileSync }))

describe('config', () => {
    afterEach(() => readFileSync.mockReset())
    test('load config TEST ENV', () => {
        readFileSync.mockImplementationOnce(() => 'PORT=3456')
        const result = require('../src/config')
        expect(result.default).toHaveProperty('port', '3456')
    })
})