import dotenv from 'dotenv'
dotenv.config()

const Config = {
    port: process.env.PORT,
    SQLHost: process.env.POSTGRES_HOST,
    SQLPort: process.env.POSTGRES_PORT,
    SQLUser: process.env.POSTGRES_USER,
    SQLPassword: process.env.POSTGRES_PASSWORD,
    SQLDatabase: process.env.POSTGRES_DB
}

export default Config