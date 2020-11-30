import { IResolvers } from 'graphql-tools';
import { Todos } from '../entities/todos';
import { getRepository, Repository } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

const resolvers: IResolvers = {
    Query: {
        todos: async (_obj, _args, _ctx) => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todos: Todos[] = await todoRepository.find()
            return todos
        }
    },
    Mutation: {
        createTodo: async (_obj, args, _ctx) => {
            const todo: Todos = new Todos()
            todo.description = args.input.description
            todo.completed = false
            todo.createdAt = new Date()
            const todoRepository: Repository<Todos> = getRepository('todos')
            const created: Todos = await todoRepository.save(todo)
            return created
        },
        modifyTodo: async (_obj, args, _ctx) => {
            const todoRepository: Repository<Todos> = getRepository('todos')
            const todo = await todoRepository.findOne(args.input.id);
            if (!todo)
                throw new ApolloError('Todo not found!');

            const update = {
                description: args.input.description,
                completed: Object.prototype.hasOwnProperty.call(args, 'completed') ? args.input.completed : todo.completed,
                updatedAt: new Date()
            }

            await todoRepository.update(args.input.id, update)
            return true
        },
        removeTodo: async (_obj, args, _ctx) => {
            const todoRepository: Repository<Todos> = getRepository('todos')

            const deleteResult = await todoRepository.createQueryBuilder()
                .delete()
                .whereInIds(args.id)
                .execute()
            return true
        }
    }
};

export default resolvers;