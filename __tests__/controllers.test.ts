import { expect } from 'chai'
import jest from 'jest-mock'
import Controllers from '../src/controllers'

function mockExpress() {
    const routes = new Map<string, jest.Mock<any>>()
    const cb = (path: string, callback: Function) => routes.set(path, jest.fn((req: any) => callback(req, { send: responseSendFn })))
    return { get: cb, post: cb, mockRequest: (route: string) => routes.get(route) }
}

let invokeResult = { Payload: JSON.stringify({}) }
const responseSendFn = jest.fn((args) => args)
const invokeFn = jest.fn((_params: any) => ({ promise: () => Promise.resolve(invokeResult) }))

const app = mockExpress()
Controllers(app, { lambda: { invoke: invokeFn } })

describe('Lambda', () => {
    describe('Summation', () => {
        it('positive', async () => {
            await app.mockRequest('/api/lambda')({ body: { num1: 9, num2: 3 } })
            
            expect(responseSendFn.mock.calls[0][0]).not.contain('Error')
            expect(responseSendFn.mock.calls[0][0]).contain('Result:')
            expect(JSON.parse(invokeFn.mock.calls[0][0].Payload)).deep.equal({ num1: 9, num2: 3 })
        })

        it('with no body', async () => {
            await app.mockRequest('/api/lambda')({})
            expect(responseSendFn.mock.calls[responseSendFn.mock.calls.length - 1][0]).contain('Error')
        })

        it('with not numbers', async () => {
            await app.mockRequest('/api/lambda')({ body: { num1: 'not number', num2: 3 } })
            expect(responseSendFn.mock.calls[responseSendFn.mock.calls.length - 1][0]).contain('not numbers')
        })

        it('payload error', async () => {
            invokeResult = { Payload: JSON.stringify({ errorMessage: 'AWS LAMBDA ERROR' }) }
            await app.mockRequest('/api/lambda')({ body: { num1: 9, num2: 3 } })
            expect(responseSendFn.mock.calls[responseSendFn.mock.calls.length - 1][0]).equal('AWS LAMBDA ERROR')
        })

        it('payload mailformed', async () => {
            invokeResult = { Payload: 'not json' }
            await app.mockRequest('/api/lambda')({ body: { num1: 9, num2: 3 } })
            expect(responseSendFn.mock.calls[responseSendFn.mock.calls.length - 1][0]).equal('Lambda Error')
        })
    })
})