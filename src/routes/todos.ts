import { Router } from 'express'
import { check, validationResult } from 'express-validator'
import * as TodoService from '../services/todoService'
import HttpException from '../exception/HttpException'
import { NextFunction } from 'express-serve-static-core'

const todosRouter = Router()

const descriptionValidators = [
    check('description').exists(),
    check('description').isLength({ min: 3 })
]

todosRouter.get('/', async (_request: any, response: any, next: NextFunction) => {
    try {
        const todos = await TodoService.list()
        return response.json({ Ok: true, todos })
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.get('/:id', async (request: any, response: any, next: NextFunction) => {
    try {
        const todo = await TodoService.get(request.params.id)
        return response.json({ Ok: true, todo })
    } catch (error) {
        return next(new HttpException(404, error))
    }
})

todosRouter.post('/', [...descriptionValidators],
    async (request: any, response: any, next: NextFunction) => {

        const errors = validationResult(request)
        if (!errors.isEmpty())
            return next(new HttpException(422, 'ValidationError', errors.array().map(e => e.msg)))

        try {
            const todo = await TodoService.create(request.body.description)
            return response.json({ Ok: true, todo })
        } catch (error) {
            return next(new HttpException(400, error))
        }
    })

todosRouter.delete('/:id', async (request: any, response: any, next: NextFunction) => {
    try {
        const removed = await TodoService.remove(request.params.id)
        return response.json({ Ok: removed })
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

todosRouter.put('/:id', [...descriptionValidators], async (request: any, response: any, next: NextFunction) => {

    const errors = validationResult(request)
    if (!errors.isEmpty())
        return next(new HttpException(422, 'ValidationError', errors.array().map(e => e.msg)))

    try {
        const modified = await TodoService.modify(request.params.id, request.body.description)
        return response.json({ Ok: modified })
    } catch (error) {
        return next(new HttpException(400, error))
    }
})

export default todosRouter