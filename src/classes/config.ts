import dotenv from 'dotenv'

export default class Config implements Config {
    public port = 3000
    constructor() {
        dotenv.config()
        if (process.env.PORT)
            this.port = Number(process.env.PORT)
    }
}