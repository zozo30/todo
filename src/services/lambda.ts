import AwsModule from '../modules/aws'
import { PromiseResult } from 'aws-sdk/lib/request'
import { Lambda, AWSError } from 'aws-sdk'

export async function summation(num1: number, num2: number): Promise<PromiseResult<Lambda.InvocationResponse, AWSError>> {
    return AwsModule().lambda.invoke({
        FunctionName: 'summation',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ num1, num2 }),
    }).promise()
}