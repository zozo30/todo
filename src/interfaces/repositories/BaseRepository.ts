import { IWrite } from './Write'
import { IRead } from './Read'
import Config from '../../classes/config'

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
    public readonly _config: Config
    public readonly _collection: any[] | any

    constructor(config: Config) {
        this._config = config
    }
    create(item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(id: string, item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    find(item: T): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
}