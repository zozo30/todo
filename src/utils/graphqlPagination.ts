import { EntitySchema, getRepository, Repository } from 'typeorm'
import { GraphQLResolveInfo } from 'graphql'

export interface IPagination {
    take: number,
    skip: number
}

export interface IPaginationResult {
    items: EntitySchema[],
    total: number,
    take: number,
    skip: number
}

export class GraphQLOrmPagination {
    public take: number = 10
    public skip: number = 0
    public entityName: string
    public query: object

    constructor(entityName: string, pagination: IPagination, query: any, info: GraphQLResolveInfo) {
        pagination = pagination || { take: 10, skip: 0 }
        this.take = pagination.take
        this.skip = pagination.skip
        this.query = query
        this.entityName = entityName
        Object.assign(query, { take: this.take, skip: this.skip })
        // tslint:disable-next-line:no-console
        // console.log(Object.keys(graphqlFields(info)))
        // tslint:disable-next-line:no-console
        // console.log(JSON.stringify(info))
        // query.select = Object.keys(graphqlFields(info))

    }

    async getResult(): Promise<IPaginationResult> {
        const repository: Repository<EntitySchema> = getRepository(this.entityName)
        const total = await repository.count(this.query)
        const items = await repository.find(this.query)

        return {
            items,
            total,
            // pages: Math.ceil(total / this.take),
            // page: Math.floor(this.skip / this.take) + 1,
            take: this.take,
            skip: this.skip
        }
    }
}