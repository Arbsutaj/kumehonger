export class NotAuthorizedException {
    constructor(message) {
        this.statusCode = 401;
        this.message = message;
    }
}
