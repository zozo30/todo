
const findAndCountAll = jest.fn()
const findOne = jest.fn()
const create = jest.fn()
const update = jest.fn()
const destroy = jest.fn()

jest.mock('sequelize', () => ({
    Sequelize: jest.fn(() => ({
        model: jest.fn(() => ({
            findAndCountAll,
            findOne,
            create,
            update,
            destroy,
        }))
    })),
    Op: jest.fn()
}))

import buildResolvers from '../src/resolvers'
import { Op } from 'sequelize'
import { FieldNode } from 'graphql'
import { Sequelize } from 'sequelize'

describe('Todo Resolver', () => {
    afterEach(() => {
        findAndCountAll.mockReset()
        findOne.mockReset()
        create.mockReset()
        update.mockReset()
        destroy.mockReset()
    })
    describe('Todos', () => {
        test('with empty filters', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, {})
            expect(findAndCountAll).toHaveBeenCalledWith({ limit: 10, offset: 0, order: [["createdAt", "DESC"]], where: {} })
        })

        test('with take=5 filter', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            const result = await resolver(null, { filters: { pagination: { take: 5 } } })
            expect(result).toHaveProperty('take', 5)
        })

        test('with skip=10 filter', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: { pagination: { skip: 5 } } })
            expect(findAndCountAll).lastCalledWith({ offset: 5, limit: 10, where: {}, order: [['createdAt', 'DESC']] })
        })

        test('with skip=20 & take=20 filter', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: { pagination: { skip: 20, take: 20 } } })
            expect(findAndCountAll).lastCalledWith({ offset: 20, limit: 20, where: {}, order: [['createdAt', 'DESC']] })
        })

        test('with completed=false filter', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: { completed: false } })
            expect(findAndCountAll).lastCalledWith({ offset: 0, limit: 10, where: { completed: false }, order: [['createdAt', 'DESC']] })
        })

        test('with search filter', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: { search: 'searchText' } })
            expect(findAndCountAll).lastCalledWith({ offset: 0, limit: 10, where: { description: { [Op.like]: '%searchText%' } }, order: [['createdAt', 'DESC']] })
        })

        test('with full filters', async () => {
            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: { completed: true, search: 'searchText', pagination: { take: 12, skip: 8 } } })
            expect(findAndCountAll).lastCalledWith({ offset: 8, limit: 12, where: { completed: true, description: { [Op.like]: '%searchText%' } }, order: [['createdAt', 'DESC']] })
        })

        test('with resolverInfoObject', async () => {
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

            const { Query: { todos: resolver } }: any = buildResolvers(new Sequelize({}))
            findAndCountAll.mockImplementationOnce(() => ({ count: 0, rows: [] }))
            await resolver(null, { filters: {} }, null, resolverInfoObject)
            expect(findAndCountAll).lastCalledWith({ offset: 0, limit: 10, where: {}, order: [['createdAt', 'DESC']], attributes: ['id', 'description', 'createdAt', 'updatedAt', 'completed'] })
        })
    })

    describe('todo', () => {
        test('getTodo id:12', async () => {
            const { Query: { todo: resolver } }: any = buildResolvers(new Sequelize({}))
            await resolver(null, { id: 12 })
            expect(findOne).lastCalledWith({ where: { id: 12 } })
        })
    })

    describe('createTodo', () => {
        test('check', async () => {
            const { Mutation: { createTodo: resolver } }: any = buildResolvers(new Sequelize({}))
            const createObj = { description: 'Test', completed: false }
            await resolver(null, { input: createObj })
            expect(create).lastCalledWith(createObj)
        })
    })

    describe('modifyTodo', () => {
        test('check', async () => {
            update.mockImplementationOnce(() => [1, { id: 1, description: 'updated' }])
            const { Mutation: { modifyTodo: resolver } }: any = buildResolvers(new Sequelize({}))
            const input = { id: 1, description: "updated" }
            await resolver(null, { input })
            expect(update).lastCalledWith(input, { where: { id: input.id }, returning: true })
        })

        test('checkNotSuccess', async () => {
            update.mockImplementationOnce(() => [0, { id: 1, description: 'updated' }])
            const { Mutation: { modifyTodo: resolver } }: any = buildResolvers(new Sequelize({}))
            const input = { id: 1, description: "updated" }
            try {
                await resolver(null, { input })
            } catch (error) {
                expect(error.message).toEqual('Update Error')
            }
        })
    })

    describe('removeTodo', () => {
        test('check', async () => {
            findOne.mockImplementationOnce(() => true)
            destroy.mockImplementationOnce(() => true)
            const { Mutation: { removeTodo: resolver } }: any = buildResolvers(new Sequelize({}))
            await resolver(null, { id: 1 })

            expect(findOne).lastCalledWith({ where: { id: 1 } })
            expect(destroy).lastCalledWith({ where: { id: 1 } })
        })

        test('notFoundItem', async () => {
            findOne.mockImplementationOnce(() => false)
            const { Mutation: { removeTodo: resolver } }: any = buildResolvers(new Sequelize({}))
            try {
                await resolver(null, { id: 1 })

            } catch (error) {
                expect(error.message).toEqual('Item not found')
            }
        })

        test('notSuccessDestroy', async () => {
            destroy.mockImplementationOnce(() => false)
            findOne.mockImplementationOnce(() => true)

            const { Mutation: { removeTodo: resolver } }: any = buildResolvers(new Sequelize({}))

            try {
                await resolver(null, { id: 1 })
            } catch (error) {
                expect(error.message).toEqual('Delete failed')
            }
        })
    })

    describe('tree', () => {
        test('check', async () => {
            findAndCountAll.mockImplementationOnce(() => ({
                count: 2,
                rows: [
                    { id: 1, description: 'todo.01', parentId: null },
                    { id: 2, description: 'todo.01', parentId: 1 }
                ]
            }))
            const { Query: { tree: resolver } }: any = buildResolvers(new Sequelize({}))
            const result = await resolver(null, {})

            expect(result.total).toEqual(2)
            expect(result.items[0]).toHaveProperty('id', 1)
            expect(result.items[0].childrens).toHaveLength(1)
            expect(result.items[0].childrens[0]).toHaveProperty('id', 2)
        })
    })
})