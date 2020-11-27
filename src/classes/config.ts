import dotenv from 'dotenv'
import { IConfig } from '../interfaces/config'

export default class Config implements IConfig {
    public port = 3000
    public inMemoryPath = ''

    constructor() {
        dotenv.config()
        if (process.env.PORT)
            this.port = Number(process.env.PORT)
        if (process.env.IN_MEMORY_DB_FILE)
            this.inMemoryPath = process.env.IN_MEMORY_DB_FILE
    }
}