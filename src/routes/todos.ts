import { Router } from 'express';
import { Todo } from '../interfaces/todos';
import shortid from 'shortid';

const todosRouter = Router();

let todos: Todo[] = [
    {
        id: shortid.generate(),
        description: 'Sample todo'
    }
];

todosRouter.get('/', (_request, response) => {
    return response.json(todos);
});

todosRouter.get('/:id', (request, response) => {
    const todo: Todo = todos.find(todo => todo.id === request.params.id);
    return response.json(todo);
});

todosRouter.post('/', (request, response) => {
    const todo: Todo = { id: shortid.generate(), description: request.body.description };
    todos = [...todos, todo];
    return response.json(todo);
});

todosRouter.delete('/:id', (request, response) => {
    todos.filter(todo => todo.id !== request.params.id);
    return response.json(todos);
});

todosRouter.put('/:id', (request, response) => {
    todos.map(todo => todo.id === request.params.id ? { ...todo, description: request.body.description } : todo);
    const todo: Todo = todos.find(todo => todo.id === request.params.id);
    return response.json(todo);
});

export default todosRouter;