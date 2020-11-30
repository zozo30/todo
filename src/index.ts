import fs from 'fs'
import { resolve } from 'path'
import Server from './classes/server'
import LoggerMiddleware from './middlewares/logger'
import ErrorMiddleware from './middlewares/error'
import NotFoundRoute from './middlewares/notFoundRoute'
import InMemoryState from './classes/inmemoryState'
import routes from './routes'
import Db from './classes/db'
import { Todos } from './entities/todos'
import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import { ApolloServer } from 'apollo-server-express'

InMemoryState.registerCollection('todos')

const server = new Server()

const db = new Db([Todos])

db.connect().then(() => {
    server.init()

    const schemaFile = resolve('./src/schema/schema.graphql');
    const typeDefs = fs.readFileSync(schemaFile, 'utf8');

    const schema: GraphQLSchema = makeExecutableSchema({
        typeDefs,
        resolvers,
    })

    const apolloServer = new ApolloServer({
        schema,
        playground: true
    })

    apolloServer.applyMiddleware({ app: server.app, path: '/graphql' })

    // routes
    server.app.use(routes)
    // log requests => method and url.
    server.applyMiddleware(LoggerMiddleware)
    // requests where the route is not existing.
    server.applyMiddleware(NotFoundRoute)
    // should be the last middleware.
    server.applyMiddleware(ErrorMiddleware)
})