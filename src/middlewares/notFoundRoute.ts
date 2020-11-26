import { NextFunction, Response } from "express-serve-static-core";

export default (_request: Request, response: Response, _next: NextFunction) => {
    response.status(404).send({ status: 404, message: 'API does not exist!' });
}