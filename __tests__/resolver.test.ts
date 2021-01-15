import buildResolvers from '../src/resolvers'
import { expect } from 'chai'
import { FindAndCountOptions, Op } from 'sequelize'
import jest from 'jest-mock'
import { FieldNode } from 'graphql'
import { get } from 'lodash'
import { assert } from 'console'

function createMockResolver(resolverNamePath: string, context: { [key: string]: jest.Mock<any> }): Function {
    return <Function>get(buildResolvers({
        model: (_: string) => ({ ...context })
    }), resolverNamePath)
}

/*
const mockFn: any = jest.fn(() => Promise.resolve({ count: 1, row: [] }))
            const { Query: { todos: resolver } }: any = buildResolvers({ model: (_: string) => ({ findAndCountAll: mockFn }) })

            await resolver(null, {})

            expect(mockFn.mock.calls[0][0]).deep.equal({ limit: 10, offset: 0, order: [["createdAt", "DESC"]], where: {} })
*/

describe('Todo Resolver', () => {
    describe('todos', () => {
        it('with empty filters', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, {})

            expect(mockFn.mock.calls[0][0]).deep.equal({ limit: 10, offset: 0, order: [["createdAt", "DESC"]], where: {} })
        })

        it('with take=5 filter', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { pagination: { take: 5 } } })

            expect(mockFn.mock.calls[0][0].limit).equal(5)
        })

        it('with skip=10 filter', async () => {

            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { pagination: { skip: 5 } } })

            expect(mockFn.mock.calls[0][0].offset).equal(5)
            expect(mockFn.mock.calls[0][0].where).deep.equal({})
        })

        it('with skip=20 & take=20 filter', async () => {

            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { pagination: { skip: 20, take: 20 } } })

            expect(mockFn.mock.calls[0][0].offset).equal(20)
            expect(mockFn.mock.calls[0][0].limit).equal(20)
        })

        it('with completed=false filter', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { completed: false } })

            expect(mockFn.mock.calls[0][0].where).deep.equal({ completed: false })
        })

        it('with search filter', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { search: 'searchText' } })

            expect(mockFn.mock.calls[0][0].where).deep.equal({ description: { [Op.like]: '%searchText%' } })
        })

        it('with full filters', async () => {

            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: { completed: true, search: 'searchText', pagination: { take: 12, skip: 8 } } })

            expect(mockFn.mock.calls[0][0]).deep.equal({
                limit: 12, offset: 8, order: [["createdAt", "DESC"]], where: {
                    completed: true,
                    description: { [Op.like]: '%searchText%' }
                }
            })
        })

        it('with resolverInfoObject', async () => {
            const resolverInfoObject = {
                fieldNodes: [{
                    kind: 'Field',
                    name: {
                        kind: 'Name',
                        value: 'todos'
                    },
                    selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                            {
                                kind: 'Field',
                                name: { kind: 'Name', value: 'total' }
                            },
                            {
                                kind: 'Field',
                                name: { kind: 'Name', value: 'take' }
                            },
                            {
                                kind: 'Field',
                                name: { kind: 'Name', value: 'skip' }
                            },
                            {
                                kind: 'Field',
                                name: { kind: 'Name', value: 'items' },
                                selectionSet: {
                                    kind: 'SelectionSet',
                                    selections: [
                                        {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: 'id' }
                                        },
                                        {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: 'description' }
                                        },
                                        {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: 'createdAt' }
                                        },
                                        {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: 'updatedAt' }
                                        },
                                        {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: 'completed' }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }] as FieldNode[]
            }

            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todos', { findAndCountAll: mockFn })

            await resolver(null, { filters: {} }, null, resolverInfoObject)

            expect(mockFn.mock.calls[0][0].attributes).deep.equal(['id', 'description', 'createdAt', 'updatedAt', 'completed'])
        })
    })

    describe('todo', () => {

        it('getTodo id:12', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Query.todo', { findOne: mockFn })

            await resolver(null, { id: 12 })

            expect(mockFn.mock.calls[0][0].where).deep.equal({ id: 12 })
        })
    })

    describe('createTodo', () => {
        it('check', async () => {
            const mockFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Mutation.createTodo', { create: mockFn })

            const createObj = { description: 'Test', completed: false }

            await resolver(null, { input: createObj })

            expect(mockFn.mock.calls[0][0]).deep.equal(createObj)
        })
    })

    describe('modifyTodo', () => {
        it('check', async () => {
            const mockFn = jest.fn((updateObj: any, matchQuery: FindAndCountOptions) => { return [1, { updateObj, matchQuery }] })
            const resolver = createMockResolver('Mutation.modifyTodo', { update: mockFn })

            const input = { id: 1, description: "updated" }

            await resolver(null, { input })

            expect(mockFn.mock.calls[0][0]).deep.equal(input)
            expect(mockFn.mock.calls[0][1].where).deep.equal({ id: 1 })
        })

        it('checkNotSuccess', async () => {
            const mockFn = jest.fn((updateObj: any, matchQuery: FindAndCountOptions) => { return [0, { updateObj, matchQuery }] })
            const resolver = createMockResolver('Mutation.modifyTodo', { update: mockFn })
            const input = { id: 1, description: "updated" }
            try {
                await resolver(null, { input })
            } catch (error) {
                expect(error.message).equal('Update Error')
            }
        })
    })

    describe('removeTodo', () => {
        it('check', async () => {
            const mockFindOneFn = jest.fn((query: FindAndCountOptions) => query)
            const mockDestroyFn = jest.fn((query: FindAndCountOptions) => query)
            const resolver = createMockResolver('Mutation.removeTodo', { findOne: mockFindOneFn, destroy: mockDestroyFn })

            await resolver(null, { id: 1 })

            expect(mockFindOneFn.mock.calls[0][0].where).deep.equal({ id: 1 })
            expect(mockDestroyFn.mock.calls[0][0].where).deep.equal({ id: 1 })
        })

        it('notFoundItem', async () => {
            const resolver = createMockResolver('Mutation.removeTodo', { findOne: jest.fn((_query: FindAndCountOptions) => null) })
            try {
                await resolver(null, { id: 1 })

            } catch (error) {
                expect(error.message).equal('Item not found')
            } 
        })

        it('notSuccessDestroy', async () => {
            const mockFindOneFn = jest.fn((query: FindAndCountOptions) => query)
            const mockDestroyFn = jest.fn((query: FindAndCountOptions) => false)
            const resolver = createMockResolver('Mutation.removeTodo', { findOne: mockFindOneFn, destroy: mockDestroyFn })

            try {
                await resolver(null, { id: 1 })
            } catch (error) {
                expect(error.message).equal('Delete failed')
            }
        })
    })

    describe('tree', () => {
        it('check', async () => {
            const mockFn = jest.fn((_query: FindAndCountOptions) => (
                {
                    count: 2, rows: [
                        { id: 1, description: 'todo.01', parentId: null },
                        { id: 2, description: 'todo.01', parentId: 1 }
                    ]
                }
            ))

            const resolver = createMockResolver('Query.tree', { findAndCountAll: mockFn })

            const result = await resolver(null, {})

            expect(result.total).equal(2)
            expect(result.items[0]).to.have.property('id', 1)
            expect(result.items[0].childrens).is.an('array').lengthOf(1)
            expect(result.items[0].childrens[0]).to.have.property('id', 2)
        })
    })

})