export class Exception {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    getJsonExceptionMessage() {
        return {status: this.statusCode, message: this.message};
    }
}
