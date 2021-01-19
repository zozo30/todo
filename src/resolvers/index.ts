import { IResolvers } from 'graphql-tools'
import { FindAndCountOptions, Op, Sequelize, WhereOptions } from 'sequelize'
import { buildTreeRecursive } from '../utils'
import { infoToProjection } from '../utils/graphql'

export default (db: Sequelize | any): IResolvers => {
    const model = db.model('Todo')

    return {
        Query: {
            todos: async (_obj, { filters }, _ctx, info) => {

                const limit = filters?.pagination?.take !== undefined ? filters.pagination.take : 10
                const offset = filters?.pagination?.skip !== undefined ? filters.pagination.skip : 0

                const where: WhereOptions<{ completed?: boolean, description?: string }> = {}

                const query = {
                    offset,
                    limit,
                    order: [['createdAt', 'DESC']],
                    where,
                } as FindAndCountOptions

                if (info && info.fieldNodes && info.fieldNodes.length > 0)
                    query.attributes = infoToProjection(info.fieldNodes[0], 'items')

                if (filters?.completed !== undefined)
                    where.completed = filters.completed

                if (filters?.search !== undefined)
                    where.description = { [Op.like]: `%${filters.search}%` }

                const { count, rows } = await model.findAndCountAll(query)

                return { total: count, items: rows, take: limit, skip: offset }
            },
            todo: async (_obj, { id }, _ctx) => model.findOne({ where: { id } }),
            tree: async (_obj, { }, _ctx) => {
                const { count, rows } = await model.findAndCountAll({ raw: true })
                return { total: count, items: buildTreeRecursive(rows) }
            }
        },
        Mutation: {
            createTodo: (_obj, { input }, _ctx) => model.create(input),
            modifyTodo: async (_obj, { input }, _ctx) => {
                const [success, updatedItem] = await model.update(input, { where: { id: input.id }, returning: true })
                if (success !== 1) throw new Error('Update Error')
                return updatedItem[0]
            },
            removeTodo: async (_obj, { id }, _ctx) => {
                const itemForDelete = await model.findOne({ where: { id } })
                if (!itemForDelete) throw new Error('Item not found')
                const success = await model.destroy({ where: { id } })
                if (!success) throw new Error('Delete failed')
                return itemForDelete
            }
        }
    }
}