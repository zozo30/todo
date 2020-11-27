import { resolve } from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

interface IState {
    [key: string]: unknown
}

class InMemoryState {
    public state: IState = {}
    private readonly _dbFilePath: string
    constructor() {
        dotenv.config()
        this._dbFilePath = resolve(process.env.IN_MEMORY_DB_FILE)
        if (!this._dbFilePath && !this._dbFilePath.includes('.json'))
            throw new Error('dbFilePath not provided')
        this.readDb()
    }

    registerCollection(collectionName: string): Promise<boolean> {
        if (!this.state.hasOwnProperty(collectionName)) {
            this.state[collectionName] = []
            return this.commitDb()
        }
    }

    getCollection(collectionName: string): any {
        return this.state[collectionName];
    }

    setCollection(collectionName: string, data: any[]) {
        this.state[collectionName] = data
    }

    async readDb(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.readFile(this._dbFilePath, (error: Error, data: any) => {
                if (error)
                    return reject(`DB File not found! ${this._dbFilePath}`)
                try {
                    this.state = JSON.parse(data)
                    resolve(true)
                } catch (e) {
                    return reject('DB File is corrupted')
                }
            })
        })
    }

    async commitDb(): Promise<boolean> {
        const data = JSON.stringify(this.state)
        return new Promise((resolve, reject) => {
            fs.writeFile(this._dbFilePath, data, 'utf-8', (error) => {
                if (error)
                    return reject('DB File write error!')
                resolve(true)
            })
        })
    }
}

export default new InMemoryState()