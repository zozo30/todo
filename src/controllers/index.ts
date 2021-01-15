import LambdaController from './lambda'

export default function (app: any, awsModule: any) {
    LambdaController(app, awsModule)
}