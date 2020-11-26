import { NextFunction, Response } from 'express-serve-static-core';
import HttpException from '../exception/HttpException';

export default (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
            status,
            message,
        })
}