import { NextFunction } from 'express'

export default (req: any, res: any, next: NextFunction): void => {
    if (req.isAuthenticated()) return next()
    return res.send({ redirect: '/login' })
}