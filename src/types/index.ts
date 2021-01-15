import { Lambda, S3 } from "aws-sdk"

export type AwsModuleType = {
    s3: S3,
    lambda: Lambda
}