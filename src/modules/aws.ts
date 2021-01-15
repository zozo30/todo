import { S3, Lambda } from 'aws-sdk'
import config from '../config'
import S3Functions from './awsS3Functions'

export default function () {

    const credentials = { accessKeyId: config.AwsAccessKeyId, secretAccessKey: config.AwsSecretAccessKey, region: 'us-east-2' }

    const s3 = new S3(credentials)
    const lambda = new Lambda(credentials)

    return {
        s3,
        lambda,
        s3Functions: S3Functions(s3, config.AwsS3Bucket)
    }
}