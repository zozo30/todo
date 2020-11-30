import { createConnection, Connection, ConnectionOptions } from 'typeorm'

export default class Db {
    public readonly entities: any[]
    public connection: Connection
    constructor(entities: any[]) {
        this.entities = entities
    }
    async connect() {
        const connectOptions: ConnectionOptions = {
            type: 'sqlite',
            database: './database.sqlite3',
            entities: this.entities,
            synchronize: true
        }
        try {
            this.connection = await createConnection(connectOptions)
        } catch (error) {
            throw new Error(error)
        }
    }
}