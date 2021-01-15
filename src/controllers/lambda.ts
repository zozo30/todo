import { AwsModuleType } from '../types'

export default function (app: any, awsModule: AwsModuleType) {
    app.post('/api/lambda', async (req: any, res: any) => {
        
        if (!req.body || !req.body.num1 || !req.body.num2) return res.send('Error: Missing Body')

        const num1 = Number(req.body.num1)
        const num2 = Number(req.body.num2)

        if (isNaN(num1) || isNaN(num2)) return res.send('Error: Provided not numbers!')

        const result = await awsModule.lambda.invoke({
            FunctionName: 'summation',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ num1: req.body.num1, num2: req.body.num2 }),
        }).promise()

        try {
            const payload = JSON.parse(result.Payload as string)
            if (payload.errorMessage) return res.send(payload.errorMessage)
            res.send(`Result: ${payload.body}`)
        } catch (err) {
            //console.log(err)
            res.send("Lambda Error")
        }
    })
}