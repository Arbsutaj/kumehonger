import {Exception} from "./exception";

export const internalExceptionMessage = 'An error has occurred. Please try again later!';

export class InternalException extends Exception {
    constructor() {
        super(500, internalExceptionMessage);
    }
}