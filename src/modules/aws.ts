import { S3 } from 'aws-sdk'
import config from '../config'
import S3Functions from './awsS3Functions'

export default function getS3() {

    const s3 = new S3({ accessKeyId: config.AwsS3AccessKeyId, secretAccessKey: config.AwsS3SecretAccessKey })

    return {
        s3,
        functions: S3Functions(s3, config.AwsS3Bucket)
    }
}