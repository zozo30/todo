import Server from './classes/server';
import LoggerMiddleware from './middlewares/logger';
import ErrorMiddleware from './middlewares/error';
import NotFoundRoute from './middlewares/notFoundRoute';

const server = new Server();

//log requests => method and url.
server.applyMiddleware(LoggerMiddleware);

//requests where the route is not existing.
server.applyMiddleware(NotFoundRoute);
//should be the last middleware.
server.applyMiddleware(ErrorMiddleware);

