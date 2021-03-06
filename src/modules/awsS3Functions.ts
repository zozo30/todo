import { S3 } from 'aws-sdk'
import fs from 'fs'

export default (s3: S3, bucket: string) => {
    return {
        UploadFile: (key: string, sourceFilePath: string, isPublic: boolean = false): Promise<S3.ManagedUpload.SendData> => {

            const fileContent = fs.readFileSync(sourceFilePath)

            return s3.upload({
                Bucket: bucket,
                Key: key,
                Body: fileContent,
                ACL: isPublic ? 'public-read' : 'private'
            }).promise()
        }
    }
}