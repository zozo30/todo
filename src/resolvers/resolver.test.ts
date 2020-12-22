import buildResolvers from '../resolvers'
const SequelizeMock = require('sequelize-mock')
import typeDefs from '../typeDefs/Todos'
import { IMockServer, IResolvers, makeExecutableSchema, mockServer } from 'graphql-tools'
import { expect } from 'chai'

describe('Todo Resolver', () => {
    const connection = new SequelizeMock()
    let Todo: any
    let server: IMockServer
    let resolvers: any

    before((done) => {

        Todo = connection.define('Todo', {})
        Todo.build({ id: 1, description: 'First Todo', completed: false })
        Todo.build({ id: 2, description: 'Second Todo', completed: true })

        resolvers = buildResolvers(connection)

        /*
        const schema = makeExecutableSchema({
            typeDefs,
            resolvers: buildResolvers(connection)
        })

        server = mockServer(schema, {}, true)
        */
        done()
    })

    describe('todos', () => {

        it('with empty filters', async () => {
            const result = await resolvers.Query.todos(null, {}, null, null)

            expect(result.take).equal(10)
            expect(result.items).to.be.an('array').that.is.not.empty
        })

        it('filter with pagination => take 5', async () => {
            const result = await resolvers.Query.todos(null, {
                filters: {
                    pagination: {
                        take: 5
                    }
                }
            }, null, null)

            expect(result.take).equal(5)
            expect(result.items).to.be.an('array').that.is.not.empty
            expect(result.items.length).lessThan(5)
        })

        it('with completed=false filter', async () => {
            const result = await resolvers.Query.todos(null, {
                filters: {
                    completed: false
                }
            }, null, null)

            expect(result.items).to.be.an('array').that.is.not.empty

            const completeds = result.items.filter((i: any) => i.completed === false)

            expect(completeds).lengthOf(result.items.length)
        })

        it('search for the second item', async () => {
            const result = await resolvers.Query.todos(null, {
                filters: {
                    search: 'Second'
                }
            }, null, null)
            console.log(result.items[0].description)
            expect(result.items).to.be.an('array').that.is.not.empty
            expect(result.items).to.have.property('description', 'Second Todo')
        })
    })
})