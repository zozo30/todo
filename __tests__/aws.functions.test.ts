const upload = jest.fn()
const readFileSync = jest.fn()

jest.mock('aws-sdk', () => ({
    Lambda: jest.fn(),
    S3: jest.fn(() => ({ upload }))
}))

jest.mock('fs', () => ({ readFileSync }))

import Aws3Functions from '../src/modules/awsS3Functions'
import { S3 } from 'aws-sdk'

describe('S3Functions', () => {
    test('Upload private file', async () => {
        upload.mockImplementationOnce(() => ({ promise: () => ({ success: true }) }))
        readFileSync.mockImplementationOnce(() => 'jpegContent')
        const s3Functions = Aws3Functions(new S3(), 'test')
        s3Functions.UploadFile('test.jpg', 'sourcePath')
        expect(upload).lastCalledWith({ Bucket: 'test', Key: 'test.jpg', Body: 'jpegContent', ACL: 'private' })
    })
    test('Upload public file', async () => {
        upload.mockImplementationOnce(() => ({ promise: () => ({ success: true }) }))
        readFileSync.mockImplementationOnce(() => 'jpegContent')
        const s3Functions = Aws3Functions(new S3(), 'test')
        s3Functions.UploadFile('test.jpg', 'sourcePath', true)
        expect(upload).lastCalledWith({ Bucket: 'test', Key: 'test.jpg', Body: 'jpegContent', ACL: 'public-read' })
    })
})