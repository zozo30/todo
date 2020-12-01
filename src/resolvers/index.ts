import { IResolvers } from 'graphql-tools'
import { Todos } from '../entities/todos'
import { getRepository, Repository } from 'typeorm'
import { ApolloError } from 'apollo-server-express'
import { GraphQLOrmPagination, IPaginationResult } from '../utils/graphqlPagination'

const resolvers: IResolvers = {
    Query: {
        todos: async (_obj, { filters }, _ctx, info): Promise<IPaginationResult> => {

            const query: any = { where: {} }
            if (filters && Object.prototype.hasOwnProperty.call(filters, 'completed'))
                query.where.completed = filters.completed

            const pagination = new GraphQLOrmPagination('todos', filters.pagination, query, info)

            return pagination.getResult()
        },
        todo: async (_obj, args, _ctx): Promise<Todos> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo: Todos = await todoRepository.findOne(args.id)

            if (!todo)
                throw new ApolloError('Todo not found!');

            return todo
        }
    },
    Mutation: {
        createTodo: async (_obj, args, _ctx): Promise<Todos> => {
            const todo: Todos = new Todos()
            todo.description = args.input.description
            todo.completed = false
            todo.createdAt = new Date()
            const todoRepository: Repository<Todos> = getRepository('todos')
            const created: Todos = await todoRepository.save(todo)
            return created
        },
        modifyTodo: async (_obj, args, _ctx): Promise<boolean> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.input.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            const update = {
                description: args.input.description ? args.input.description : todo.description,
                completed: Object.prototype.hasOwnProperty.call(args, 'completed') ? Boolean(args.input.completed) : todo.completed,
                updatedAt: new Date()
            }

            await todoRepository.update(args.input.id, update)
            return true
        },
        removeTodo: async (_obj, args, _ctx): Promise<boolean> => {
            const todoRepository: Repository<Todos> = getRepository('todos')

            const deleteResult = await todoRepository.createQueryBuilder()
                .delete()
                .whereInIds(args.id)
                .execute()
            return true
        },
        setCompleted: async (_obj, args, _ctx): Promise<boolean> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.input.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            const update = {
                completed: Boolean(args.input.completed),
                updatedAt: new Date()
            }

            await todoRepository.update(args.input.id, update)
            return true
        }
    }
};

export default resolvers;