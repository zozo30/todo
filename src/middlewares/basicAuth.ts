import { NextFunction } from 'express'
import config from '../config'

export default (request: any, response: any, next: NextFunction): void => {

    const b64auth = (request.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (login && password && login === config.BasicAuthUser && password === config.BasicAuthPassword )
        return next()

    response.set('WWW-Authenticate', 'Basic realm="401"')
    response.status(401).send('Authentication required.')

}