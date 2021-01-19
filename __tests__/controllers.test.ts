const invokeMock = jest.fn()

jest.mock('aws-sdk', () => ({
    Lambda: jest.fn(() => ({ invoke: invokeMock })),
    S3: jest.fn()
}))

import * as LambdaController from '../src/controllers/lambda'

describe('Lambda', () => {

    afterEach(() => invokeMock.mockReset())

    describe('Summation', () => {
        test('positive', async () => {
            const sendMock = jest.fn()
            invokeMock.mockImplementationOnce(() => ({ promise: () => ({ Payload: '{"body":10}' }) }))
            await LambdaController.summation({ body: { num1: 5, num2: 5 } }, { send: sendMock })
            expect(JSON.parse(invokeMock.mock.calls[0][0].Payload)).toMatchObject({ num1: 5, num2: 5 })
            expect(invokeMock).toHaveBeenCalledTimes(1)
            expect(sendMock).toHaveBeenCalledTimes(1)
            expect(sendMock).lastCalledWith('Result: 10')
        })

        test('with no body', async () => {
            const sendMock = jest.fn()
            await LambdaController.summation({}, { send: sendMock })
            expect(sendMock).lastCalledWith('Error: Missing Body')
            expect(sendMock).toHaveBeenCalledTimes(1)
        })

        test('with not numbers', async () => {
            const sendMock = jest.fn()
            await LambdaController.summation({ body: { num1: 'a', num2: 3 } }, { send: sendMock })
            expect(sendMock).lastCalledWith('Error: Provided not numbers!')
            expect(sendMock).toHaveBeenCalledTimes(1)
        })

        test('payload json error', async () => {
            const sendMock = jest.fn()
            invokeMock.mockImplementationOnce(() => ({ promise: () => ({ Payload: 'not JSON' }) }))
            await LambdaController.summation({ body: { num1: 5, num2: 5 } }, { send: sendMock })
            expect(invokeMock).toHaveBeenCalledTimes(1)
            expect(sendMock).toHaveBeenCalledTimes(1)
            expect(sendMock).lastCalledWith('Lambda Error')
        })

        test('aws error', async () => {
            const sendMock = jest.fn()
            invokeMock.mockImplementationOnce(() => ({ promise: () => ({ Payload: JSON.stringify({ errorMessage: 'AWS LAMBDA ERROR' }) }) }))
            await LambdaController.summation({ body: { num1: 5, num2: 5 } }, { send: sendMock })
            expect(invokeMock).toHaveBeenCalledTimes(1)
            expect(sendMock).toHaveBeenCalledTimes(1)
            expect(sendMock).lastCalledWith('AWS LAMBDA ERROR')
        })
    })
})