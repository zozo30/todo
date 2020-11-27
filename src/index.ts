import Server from './classes/server'
import LoggerMiddleware from './middlewares/logger'
import ErrorMiddleware from './middlewares/error'
import NotFoundRoute from './middlewares/notFoundRoute'
import InMemoryState from './classes/inmemoryState'
import routes from './routes'

InMemoryState.registerCollection('todos')

const server = new Server()
// routes
server.app.use(routes)
// log requests => method and url.
server.applyMiddleware(LoggerMiddleware)
// requests where the route is not existing.
server.applyMiddleware(NotFoundRoute)
// should be the last middleware.
server.applyMiddleware(ErrorMiddleware)