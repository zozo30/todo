import { NextFunction, Response } from 'express-serve-static-core';
import { Config } from '../types/config'

export interface IServer {
    running: boolean,
    errored: boolean,
    error?: string | null,
    app: Express.Application,
    config?: Config,
    applyMiddleware: (middleware: (request: Request, response: Response, next: NextFunction) => void) => void
}