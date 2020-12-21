import gql from "graphql-tag";

export default gql`
    scalar DateTime

    type Query{
        todos(filters: TodoFilter): ListResult!
        todo(id: Int!): Todo
    }

    type Mutation{
        createTodo(input: TodoInput!): Todo
        modifyTodo(input: TodoModifyInput!): Todo
        removeTodo(id: Int!): Todo
        setCompleted(input: TodoCompletedInput!): Todo
    }

    type Todo {
        id: Int!
        description: String!
        createdAt: DateTime
        updatedAt: DateTime
        completed: Boolean
    }

    input TodoFilter {
        completed: Boolean
        pagination: PaginationInput
        search: String
    }

    type ListResult {
        items: [Todo]
        total: Int
        take: Int
        skip: Int
    }

    input PaginationInput {
        skip: Int
        take: Int
    }

    input TodoInput {
        description: String!
    }

    input TodoModifyInput {
        id: Int!
        description: String
        completed: Boolean
    }

    input TodoCompletedInput {
        id: Int!
        completed: Boolean
    }
`