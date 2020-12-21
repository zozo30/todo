import { Sequelize } from 'sequelize'
import { ConfigType } from './app'

export default async (config: ConfigType): Promise<Sequelize> => {
    const sequelize = new Sequelize({
        host: config.SQLHost,
        port: Number(config.SQLPort),
        username: config.SQLUser,
        password: config.SQLPassword,
        database: config.SQLDatabase,
        dialect: 'postgres'
    })

    await sequelize.authenticate()

    return sequelize
}