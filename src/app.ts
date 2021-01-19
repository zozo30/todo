import express from 'express'
import session from 'express-session'
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
import GitHubAuth from './modules/githubAuth'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { resolve, dirname } from 'path'
import AwsModule from './modules/aws'
import bodyParser from 'body-parser'
import Routes from './routes'


export type ConfigType = typeof Config
export type App = { app: any, db: Sequelize, server: Server, config: ConfigType }

const appDir = dirname(require.main.filename);

export default async (): Promise<App> => {
    const app = express()

    //app.set('views', resolve('views'))
    //app.set('view engine', 'hbs')
    app.use(cors())
    app.use(bodyParser.json())
    app.use(express.static(resolve('public')))

    const db = await dbInit(Config)

    initEntities(db)

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers: buildResolvers(db)
    })

    console.log(`http://localhost:${Config.port}/auth/github/callback`)

    /*
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))

    passport.use(new GitHubStrategy({
        clientID: Config.GithubClientId,
        clientSecret: Config.GithubClientSecret,
        callbackURL: `http://localhost:${Config.port}/auth/github/callback`
    }, (access_token: string, refreshToken: string, profile: any, done: any) => {
        process.nextTick(() => {
            return done(null, profile)
        })
    }))

    app.use(session({ secret: Config.SessionSecret, resave: false, saveUninitialized: false }))
    app.use(passport.initialize())
    app.use(passport.session())
    GitHubAuth(app)
    app.use(middlewares.Auth)

    //app.get('/', (req: any, res: any) => res.render('index', { user: req.user }))
    */

    app.use(middlewares.Logger)
    app.use('/api/graphql', graphqlHTTP({ schema, graphiql: true }))

    Routes(app)

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