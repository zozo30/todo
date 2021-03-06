import dotenv from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
    const envConfig = dotenv.parse(fs.readFileSync(resolve(`.env.${process.env.NODE_ENV}`)))
    Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key])
}

const Config = {
    port: process.env.PORT,
    SQLHost: process.env.POSTGRES_HOST,
    SQLPort: process.env.POSTGRES_PORT,
    SQLUser: process.env.POSTGRES_USER,
    SQLPassword: process.env.POSTGRES_PASSWORD,
    SQLDatabase: process.env.POSTGRES_DB,
    BasicAuthUser: process.env.BASIC_AUTH_USER,
    BasicAuthPassword: process.env.BASIC_AUTH_PASSWORD,
    AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AwsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    AwsS3Bucket: process.env.AWS_S3_BUCKET,
    GithubClientId: process.env.GITHUB_CLIENT_ID,
    GithubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    SessionSecret: process.env.SESSION_SECRET
}

//console.log(`config ${process.env.NODE_ENV} loaded`, Config)

export default Config