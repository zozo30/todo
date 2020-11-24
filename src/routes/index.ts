import { Router } from 'express';
import todosRouter from './todos';

const routes = Router();

routes.use('/todos', todosRouter);

export default routes;