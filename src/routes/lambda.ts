import * as LambdaController from '../controllers/lambda'

export default (app: any) => {
    app.post('/api/lambda', LambdaController.summation)
}