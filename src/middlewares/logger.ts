export default (request: Request, _response: any, next: any) => {
    // tslint:disable-next-line:no-console
    console.log(`${request.method} ${request.url}`);
    next();
}