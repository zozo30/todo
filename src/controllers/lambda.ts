import * as LambdaService from '../services/lambda'

export async function summation(req: any, res: any) {
    if (!req.body || !req.body.num1 || !req.body.num2) return res.send('Error: Missing Body')

    const num1 = Number(req.body.num1)
    const num2 = Number(req.body.num2)

    if (isNaN(num1) || isNaN(num2)) return res.send('Error: Provided not numbers!')

    const result = await LambdaService.summation(num1, num2)
    
    try {
        const payload = JSON.parse(result.Payload as string)
        if (payload.errorMessage) return res.send(payload.errorMessage)
        res.send(`Result: ${payload.body}`)
    } catch (err) {
        res.send("Lambda Error")
    }
}