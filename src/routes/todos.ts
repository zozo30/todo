import { Router } from 'express'
import { Todo } from '../interfaces/todos'
import * as TodoService from '../services/todoService'
import HttpException from '../exception/HttpException'

const todosRouter = Router()

todosRouter.get('/', async (_request, response, next) => {
    try {
        const todos: Todo[] = await TodoService.list()
        return response.json(todos)
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.get('/:id', async (request, response, next) => {
    try {
        const todo: Todo = await TodoService.get(request.params.id)
        return response.json(todo)
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.post('/', async (request, response, next) => {
    try {
        const createdItem: Todo = await TodoService.create(request.body.description)
        return response.json(createdItem)
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.delete('/:id', async (request, response, next) => {
    try {
        const removed = await TodoService.remove(request.params.id)
        return response.json({ Ok: removed })
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.put('/:id', async (request, response, next) => {
    try {
        const modified = await TodoService.modify(request.params.id, request.body.description)
        return response.json({ Ok: modified })
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

export default todosRouter;