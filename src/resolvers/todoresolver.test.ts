
import { init } from '../init'
import axios from 'axios'
import Server from '../classes/server'
import { expect } from 'chai'
import { getRepository, Repository } from 'typeorm'
import { Todos } from '../entities/todos'

describe('TodoGraphQL', () => {
    let graphPath: string
    let _server: Server
    const TEST_TODO_DESCRIPTION = '#Test Todo'

    before((done) => {
        init().then((server) => {
            _server = server
            graphPath = `http://localhost:${server.config.port}/graphql`
            // tslint:disable-next-line:no-console
            console.log(graphPath)
            done()
        })
    })

    after((done) => {
        _server.dispose()
        done()
    })

    describe('CreateTodo', () => {
        describe('success', () => {
            it('check', async () => {
                const query = `
                    mutation{
                        createTodo(input:{description:"${TEST_TODO_DESCRIPTION}"}){id,description,createdAt}
                    }
                `
                try {
                    const response = await axios.post(graphPath, { query })
                    expect(response.status).to.equal(200)
                    expect(response.data.data).to.have.property('createTodo')
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
    })

    describe('ListTodos', () => {
        describe('success', () => {
            describe('withPagination', () => {
                it('check', async () => {
                    const query = `
                    query {
                        todos(filters: { pagination: { skip: 0, take: 10 } }) {
                          total
                          items {
                            id
                          }
                        }
                      }
                    `
                    try {
                        const response = await axios.post(graphPath, { query })
                        expect(response.status).to.equal(200)
                        expect(response.data.data).to.have.property('todos')
                        expect(response.data.data.todos.total).not.equal(0)
                    } catch (error) {
                        throw new Error(error)
                    }
                })
            })

            describe('withUncompletedFilter', () => {
                it('check', async () => {
                    const query = `
                    query {
                        todos(filters: { completed:false }) {
                          total
                          items {
                            id
                          }
                        }
                      }
                    `
                    try {
                        const response = await axios.post(graphPath, { query })
                        expect(response.status).to.equal(200)
                        expect(response.data.data).to.have.property('todos')
                        expect(response.data.data.todos.total).not.equal(0)
                    } catch (error) {
                        throw new Error(error)
                    }
                })
            })
        })
    })

    describe('GetTodo', () => {
        describe('success', () => {
            it('check', async () => {
                const todoRepository: Repository<Todos> = getRepository('todos')
                const result = await todoRepository.createQueryBuilder().where({ description: TEST_TODO_DESCRIPTION }).limit(1).execute()
                expect(result).lengthOf(1)

                const query = `
                    query {
                        todo(id:${result[0].Todos_id}){
                            id
                        }
                    }
                `
                try {
                    const response = await axios.post(graphPath, { query })
                    expect(response.status).to.equal(200)
                    expect(response.data.data).to.have.property('todo')
                    expect(response.data.data.todo).to.not.equal(null)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
    })

    describe('SetCompleted', () => {
        it('check', async () => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const result = await todoRepository.createQueryBuilder().where({ description: TEST_TODO_DESCRIPTION }).limit(1).execute()
            expect(result).lengthOf(1)

            const query = `
                mutation {
                    setCompleted(input:{id:${result[0].Todos_id},completed:true})
                }
            `

            try {
                const response = await axios.post(graphPath, { query })
                expect(response.status).to.equal(200)
                expect(response.data.data.setCompleted).to.equal(true)
            } catch (error) {
                throw new Error(error)
            }
        })
    })

    describe('ModifyTodo', () => {
        it('check', async () => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const result = await todoRepository.createQueryBuilder().where({ description: TEST_TODO_DESCRIPTION }).limit(1).execute()
            expect(result).lengthOf(1)

            const query = `
                mutation {
                    modifyTodo(input:{id:${result[0].Todos_id},completed:false})
                }
            `

            try {
                const response = await axios.post(graphPath, { query })
                expect(response.status).to.equal(200)
                expect(response.data).not.to.have.property('errors')
            } catch (error) {
                throw new Error(error)
            }
        })
    })

    describe('RemoveTodo', () => {
        describe('success', () => {
            it('check', async () => {

                const todoRepository: Repository<Todos> = getRepository('todos')
                const result = await todoRepository.createQueryBuilder().where({ description: TEST_TODO_DESCRIPTION }).limit(1).execute()
                expect(result).lengthOf(1)

                const query = `
                    mutation {
                        removeTodo(id:${result[0].Todos_id})
                    }
                `
                try {
                    const response = await axios.post(graphPath, { query })
                    expect(response.status).to.equal(200)
                    expect(response.data.data).to.have.property('removeTodo')
                    expect(response.data.data.removeTodo).to.equal(true)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })
    })
})