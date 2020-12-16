export class BadParameterException {
    constructor(parameterName, parameterValue) {
        this.statusCode = 400;
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.statusDescription = 'Bad parameter';
    }

    getJsonBadParameterExceptionMessage() {
        return {status: this.statusCode, statusDescription: this.statusDescription, message: 'Wrong value: ' + this.parameterValue + ' for \'' + this.parameterName + '\' parameter'};
    }
}
