import { expect } from 'chai'
import shortid from 'shortid'
import * as TodoService from './todoService'
import InMemoryState from '../classes/inmemoryState'

describe('TodoService', () => {
    let testItemId: string
    before((done) => {

        InMemoryState.readDb().then((success) => {
            if (!success) return done('DB is not ready!')
            const todos = InMemoryState.getCollection('todos')

            const todo = { id: shortid.generate(), description: 'test_todo_###' }
            testItemId = todo.id

            InMemoryState.setCollection('todos', [...todos, todo])

            InMemoryState.commitDb().then((writeOk) => {
                if (!writeOk)
                    return done('Commit DB not working!')
                done()
            })
        })
    })

    after((done) => {
        InMemoryState.setCollection('todos', [])
        InMemoryState.commitDb().then((writeOk) => {
            if (!writeOk)
                return done('Commit DB not working!')
            done()
        })
    })

    describe('list', () => {
        it('check', async () => {
            const result = await TodoService.list()
            expect(result).to.be.an('array').to.deep.include({ id: testItemId, description: 'test_todo_###' })
        })
    })
    describe('create', () => {
        describe('success', () => {
            it('check', async () => {
                const result = await TodoService.create('example todo')
                expect(result).to.have.property('id')
                expect(result).to.have.property('description', 'example todo')
            })
        })
        describe('failWithNull', () => {
            it('check', async () => {
                try {
                    await TodoService.create(null)
                } catch (error) {
                    expect(error).to.equal('TodoService.ArgumentsNullOrEmpty')
                }
            })
        })
        describe('failWithEmpty', () => {
            it('check', async () => {
                try {
                    await TodoService.create('')
                } catch (error) {
                    expect(error).to.equal('TodoService.ArgumentsNullOrEmpty')
                }
            })
        })
    })

    describe('get', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const todo = await TodoService.get(testItemId)
                    expect(todo).to.not.equal(null)
                    expect(todo).to.have.property('id', testItemId)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })

        describe('fail', () => {
            it('check', async () => {
                try {
                    await TodoService.get('*')
                } catch (error) {
                    expect(error).to.equal('TodoService.TodoNotFound')
                }
            })
        })
    })

    describe('modify', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const modified = await TodoService.modify(testItemId, 'modified')
                    expect(modified).to.equal(true)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })

        describe('failWithNotExistingItem', () => {
            it('check', async () => {
                try {
                    await TodoService.modify('*', 'modified')
                } catch (error) {
                    expect(error).to.equal('TodoService.ModifyItemNotFound')
                }
            })
        })

        describe('failWithArguments', () => {
            it('check', async () => {
                try {
                    const modified = await TodoService.modify(null, 'modified')
                    expect(modified).to.not.equal(true)
                } catch (error) {
                    expect(error).to.equal('TodoService.ArgumentsNullOrEmpty')
                }
            })
        })
    })

    describe('remove', () => {
        describe('success', () => {
            it('check', async () => {
                try {
                    const removed = await TodoService.remove(testItemId)
                    expect(removed).to.equal(true)
                } catch (error) {
                    throw new Error(error)
                }
            })
        })

        describe('failWithNotExistingItem', () => {
            it('check', async () => {
                try {
                    const removed = await TodoService.remove('*')
                    expect(removed).to.not.equal(true)
                } catch (error) {
                    expect(error).to.equal('TodoService.RemoveItemNotFound')
                }
            })
        })
    })
})