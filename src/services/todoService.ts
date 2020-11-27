import Todo from '../types/todo'
import InMemoryState from '../classes/inmemoryState'
import shortid from 'shortid'

export const list = async (): Promise<Todo[]> => {
    try {
        const todos: Todo[] = InMemoryState.getCollection('todos')
        return Promise.resolve(todos)
    } catch (error) {
        return Promise.reject('TodoService.ListError')
    }
}

export const create = async (description: string): Promise<Todo> => {
    if (!description || description === '') return Promise.reject('TodoService.ArgumentsNullOrEmpty')

    try {
        const createItem: Todo = { id: shortid.generate(), description }
        const collection: Todo[] = InMemoryState.getCollection('todos')
        InMemoryState.setCollection('todos', [...collection, createItem])
        const writeOk: boolean = await InMemoryState.commitDb()
        if (!writeOk)
            return Promise.reject('TodoService.CreateError')
        return Promise.resolve(createItem)
    } catch (error) {
        return Promise.reject('TodoService.CreateError')
    }
}

export const get = async (id: string): Promise<Todo> => {
    if (!id || id === '')
        return Promise.reject('TodoService.ArgumentsNullOrEmpty')

    try {
        const todos: Todo[] = InMemoryState.getCollection('todos')
        const todo: Todo = todos.find((t) => t.id === id)
        if (!todo)
            return Promise.reject('TodoService.TodoNotFound')
        return Promise.resolve(todo)
    } catch (error) {
        return Promise.reject('TodoService.GetTodoError')
    }
}

export const remove = async (id: string): Promise<boolean> => {
    if (!id || id === '')
        return Promise.reject('TodoService.ArgumentsNullOrEmpty')

    const todos: Todo[] = InMemoryState.getCollection('todos')
    const removeTodo: Todo = todos.find((t) => t.id === id)
    if (!removeTodo)
        return Promise.reject('TodoService.RemoveItemNotFound')
    InMemoryState.setCollection('todos', todos.filter((t => t.id !== id)))
    const writeOk: boolean = await InMemoryState.commitDb()
    if (!writeOk)
        return Promise.reject('TodoService.RemoveError')

    return Promise.resolve(true)
}

export const modify = async (id: string, modifiedDescription: string): Promise<boolean> => {
    if (!id || id === ''
        || !modifiedDescription || modifiedDescription === '')
        return Promise.reject('TodoService.ArgumentsNullOrEmpty')

    const todos: Todo[] = InMemoryState.getCollection('todos')
    const modifyTodo: Todo = todos.find((t) => t.id === id)
    if (!modifyTodo)
        return Promise.reject('TodoService.ModifyItemNotFound')

    InMemoryState.setCollection('todos', todos.map((t => t.id === id ? { ...t, description: modifiedDescription } : t)))
    const writeOk: boolean = await InMemoryState.commitDb()
    if (!writeOk)
        return Promise.reject('TodoService.ModifyError')

    return Promise.resolve(true)
}