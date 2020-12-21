export default (_request: Request, response: any): void => {
    const status = 500;
    const message = 'Something went wrong';
    response
        .status(status)
        .send({
            status,
            message,
        })
}