export default (_: Request, response: any) => {
    response.status(404).send({ status: 404, message: 'API does not exist!' });
}