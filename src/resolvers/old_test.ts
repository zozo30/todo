import axios from 'axios'
import { expect } from 'chai'
import { print } from 'graphql';
import gql from "graphql-tag";
import initApp, { App } from '../app'

var context: App
var currenItemId: string

function useGraphQL(query: any, variables: any) {
    return axios.post(`http://localhost:${context.config.port}/graphql`, { query: print(query), variables })
}

describe('TodoGraphQL', () => {

    before(async () => {
        context = await initApp()
    })

    after((done) => {
        done()
    })

    beforeEach(async () => {
        const createdItem: any = await context.db.model('Todo').create({ description: 'UNIT_TESTING_TODO_ITEM' })
        currenItemId = createdItem.id
    })

    afterEach(async () => {
        await context.db.model('Todo').destroy({ where: { id: currenItemId } })
    })

    describe('CreateTodo', () => {
        describe('positive', () => {
            it('check', async () => {
                const query = gql`
                    mutation CreateTodo ($input: TodoInput!){
                        createTodo(input:$input){
                            id,
                            description,
                            createdAt,
                            updatedAt,
                            completed
                        }
                    }`
                const response = await useGraphQL(query, { input: { description: "from test" } })

                await context.db.model('Todo').destroy({ where: { id: response.data.data?.createTodo?.id } })

                expect(response.status).to.equal(200)
                expect(response.data.data).to.have.property('createTodo')
                expect(response.data.data.createTodo).to.have.property('description')
            })
        })
    })

    describe('ListTodos', () => {
        describe('positive', () => {
            it('check', async () => {
                const query = gql`
                    query ListTodos($filters:TodoFilter){
                        todos(filters:$filters){take,skip,total,items{
                            id,
                            description,
                            }
                        }
                    }`

                const response = await useGraphQL(query, {
                    filters: {
                        completed: false,
                        pagination: {
                            take: 30,
                        }
                    }
                })

                expect(response.status).to.equal(200)
                expect(response.data.data).to.have.property('todos')
                expect(response.data.data.todos.total).not.equal(0)
            })
        })
    })

    describe('GetTodo', () => {
        describe('positive', () => {
            it('check', async () => {

                const query = gql`
                    query GetTodo($id:Int!){
                        todo(id:$id){id,description,completed,createdAt,updatedAt}
                    }
                `

                const response = await useGraphQL(query, { id: currenItemId })

                expect(response.status).to.equal(200)
                expect(response.data.data).to.have.property('todo')
                expect(response.data.data.todo).to.not.equal(null)

            })
        })
    })

    describe('ModifyTodo', () => {
        describe('positive', () => {
            it('check', async () => {

                const query = gql`
                    mutation ModifyTodo($input:TodoModifyInput!){
                        modifyTodo(input:$input){id,description,updatedAt}
                    }
                `

                const response = await useGraphQL(query, { input: { id: currenItemId, description: 'UPDATED' } })
                expect(response.status).to.equal(200)
                expect(response.data).not.to.have.property('errors')
                expect(response.data.data).to.have.property('modifyTodo')
                expect(response.data.data.modifyTodo.description).equal('UPDATED')
            })
        })
    })

    describe('RemoveTodo', () => {
        describe('positive', () => {
            it('check', async () => {

                const query = gql`
                   mutation RemoveTodo($id:Int!){
                        removeTodo(id:$id){id,description}
                    }
                `
                const response = await useGraphQL(query, { id: currenItemId })
                expect(response.status).to.equal(200)
                expect(response.data.data).to.have.property('removeTodo')
                expect(response.data.data.removeTodo.id).equal(currenItemId)
            })
        })
    })
})