import {Exception} from "./exception";

export class BadParameterException extends Exception {
    constructor(parameterName, parameterValue) {
        super(400, 'Wrong value: ' + parameterValue + ' for \'' + parameterName + '\' parameter');
    }
}
