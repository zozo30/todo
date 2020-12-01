import { resolve } from 'path'
import fs from 'fs'
import Server from './classes/server'
import Db from './classes/db'
import { Todos } from './entities/todos'
import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { ApolloServer } from 'apollo-server-express'
import LoggerMiddleware from './middlewares/logger'
import ErrorMiddleware from './middlewares/error'
import NotFoundRoute from './middlewares/notFoundRoute'
import resolvers from './resolvers'
import routes from './routes'

export async function init(): Promise<Server> {
    const server = new Server()

    const db = new Db([Todos])
    return db.connect().then(() => {
        return server.init().then(() => {
            const schemaFile = resolve('src/schema/schema.graphql')
            const typeDefs = fs.readFileSync(schemaFile, 'utf8')

            const schema: GraphQLSchema = makeExecutableSchema({
                typeDefs,
                resolvers,
            })

            const apolloServer = new ApolloServer({
                schema,
                playground: true
            })

            apolloServer.applyMiddleware({ app: server.app, path: '/graphql' })

            server.app.use(routes)

            // log requests => method and url.
            server.applyMiddleware(LoggerMiddleware)
            // requests where the route is not existing.
            server.applyMiddleware(NotFoundRoute)
            // should be the last middleware.
            server.applyMiddleware(ErrorMiddleware)

            return server
        })
    })
}