import {Exception} from "./exception";

export class NotAuthorizedException extends Exception {
    constructor(message) {
        super(401, message);
    }
}
