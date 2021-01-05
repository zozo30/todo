import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './typeDefs/Todos'
import Config from './config'
import dbInit from './db'
import { Sequelize } from 'sequelize/types'
import initEntities from './entities'
import buildResolvers from './resolvers'
import middlewares from './middlewares'
import { log } from './utils/logger'
import { Server } from 'http'
import { once } from 'events'

export type ConfigType = typeof Config
export type App = { app: any, db: Sequelize, server: Server, config: ConfigType }

export default async (): Promise<App> => {
    const app = express()

    const db = await dbInit(Config)

    initEntities(db)

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers: buildResolvers(db)
    })

    app.use(middlewares.Logger)
    app.use(middlewares.BasicAuth)
    app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))
    app.use(middlewares.NotFoundRoute)
    app.use(middlewares.Error)

    const server = app.listen(Config.port, () => log(`graphQL listening on ${Config.port}`))
    await once(server, 'listening')

    return {
        app,
        db,
        server,
        config: Config
    }
}