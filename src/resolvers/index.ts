import { IResolvers } from 'graphql-tools'
import { Todos } from '../entities/todos'
import { getRepository, Like, Repository } from 'typeorm'
import { ApolloError } from 'apollo-server-express'
import { GraphQLOrmPagination, IPaginationResult } from '../utils/graphqlPagination'

const resolvers: IResolvers = {
    Query: {
        todos: async (_obj, { filters }, _ctx, info): Promise<IPaginationResult> => {

            const query: any = { where: {} }
            if (filters && Object.prototype.hasOwnProperty.call(filters, 'completed'))
                query.where.completed = filters.completed

            query.order = {
                createdAt: 'DESC'
            }

            if (filters && Object.prototype.hasOwnProperty.call(filters, 'search'))
                query.where.description = Like(`%${filters.search}%`)

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
        modifyTodo: async (_obj, args, _ctx): Promise<any> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.input.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            const updatedAt = new Date()

            const update = {
                description: args.input.description ? args.input.description : todo.description,
                completed: Object.prototype.hasOwnProperty.call(args, 'completed') ? Boolean(args.input.completed) : todo.completed,
                updatedAt
            }

            await todoRepository.update(args.input.id, update)

            const updatedTodo = await todoRepository.findOne(args.input.id);

            return updatedTodo
        },
        removeTodo: async (_obj, args, _ctx): Promise<any> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            await todoRepository.createQueryBuilder()
                .delete()
                .whereInIds(args.id)
                .execute()
            return todo
        },
        setCompleted: async (_obj, args, _ctx): Promise<{ id: number, completed: boolean }> => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.input.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            const completed = Boolean(args.input.completed)

            const update = {
                completed,
                updatedAt: new Date()
            }

            await todoRepository.update(args.input.id, update)
            const updatedTodo = await todoRepository.findOne(args.input.id);
            return updatedTodo
        }
    }
};

export default resolvers;