import { IServer } from '../interfaces/server'
import Config from './config'
import express from 'express'

class Server implements IServer {
    public running = false
    public errored = false
    public app = express()
    public config = new Config()

    constructor() {
        this.init()
    }

    async init() {
        this.app.use(express.json())

        return new Promise((resolve, _reject) => {
            this.app.listen(this.config.port, () => {
                this.running = true;
                // tslint:disable-next-line:no-console
                console.log(`server started at http://localhost:${this.config.port}`)
                resolve(true);
            })
        });
    }

    applyMiddleware(middleware: any) {
        this.app.use(middleware)
    }

}

export default Server