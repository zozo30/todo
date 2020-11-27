import { IServer } from '../interfaces/server'
import Config from './config'
import express from 'express'
import { EventEmitter } from 'events'

class Server extends EventEmitter implements IServer {
    public running = false
    public errored = false
    public app = express()
    public config = new Config()

    constructor() {
        super()
    }

    async init() {
        this.app.use(express.json())

        return new Promise((resolve, _reject) => {
            this.app.listen(this.config.port, () => {
                this.running = true;
                // tslint:disable-next-line:no-console
                console.log(`server started at http://localhost:${this.config.port}`)
                this.emit('ready')
                return resolve(true);
            })
        })
    }

    applyMiddleware(middleware: any) {
        this.app.use(middleware)
    }

}

export default Server