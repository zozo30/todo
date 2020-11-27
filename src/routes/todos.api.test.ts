import { expect } from 'chai'
import shortid from 'shortid'
import axios from 'axios'
import Server from '../classes/server'
import routes from '../routes'
import { Todo } from '../interfaces/todos'
import LoggerMiddleware from '../middlewares/logger'
import ErrorMiddleware from '../middlewares/error'
import NotFoundRoute from '../middlewares/notFoundRoute'
import InMemoryState from '../classes/inmemoryState'

describe('TodosApi', () => {
    const server: Server = new Server()
    const serverPath = `http://localhost:${server.config.port}`
    const testItem: Todo = { id: shortid.generate(), description: 'api_test_todo_###' }
    before((done) => {
        server.on('ready', () => {

            InMemoryState.setCollection('todos', [testItem])

            InMemoryState.commitDb().then((writeOk) => {
                if (!writeOk)
                    return done('Commit DB not working!')
                done()
            })
        })
        server.init()
        server.app.use(routes)
        server.applyMiddleware(LoggerMiddleware)
        server.applyMiddleware(NotFoundRoute)
        server.applyMiddleware(ErrorMiddleware)
    })

    describe('list', () => {
        it('check', async () => {
            try {
                const result = await axios.get(`${serverPath}/todos`)

                expect(result.status).equal(200)
                expect(result.data).to.have.property('Ok', true)
                expect(result.data).to.have.property('todos')
                    .is.an('array')
                    .to.deep.include(testItem)
            } catch (error) {
                throw new Error(error)
            }
        })
    })

    describe('create', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const result = await axios.post(`${serverPath}/todos`, { description: 'my first todo' })

                    expect(result.status).equal(200)
                    expect(result.data).to.have.property('Ok', true)
                    expect(result.data).to.have.property('todo')
                    expect(result.data.todo).to.have.property('id')
                } catch (error) {
                    throw new Error(error)
                }
            })
        })

        describe('failNoBody', () => {
            it('check', async () => {
                try {
                    await axios.post(`${serverPath}/todos`)
                } catch (error) {
                    // tslint:disable-next-line:no-console
                    expect(error.response.data.status).equal(422)
                    expect(error.response.data.message).equal('ValidationError')
                }
            })
        })
    })

    describe('get', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const result = await axios.get(`${serverPath}/todos/${testItem.id}`)

                    expect(result.status).equal(200)
                    expect(result.data).to.have.property('Ok', true)
                    expect(result.data).to.have.property('todo')
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
        describe('fail', () => {
            it('check', async () => {
                try {
                    await axios.get(`${serverPath}/todos/null`)
                } catch (error) {
                    expect(error.response.data.status).equal(404)
                }
            })
        })
    })

    describe('modify', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const result = await axios.put(`${serverPath}/todos/${testItem.id}`, { description: 'modified todo' })

                    expect(result.status).equal(200)
                    expect(result.data).to.have.property('Ok', true)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
    })

    describe('remove', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const result = await axios.delete(`${serverPath}/todos/${testItem.id}`)
                    expect(result.status).equal(200)
                    expect(result.data).to.have.property('Ok', true)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
    })
})