import {Exception} from "./exception";

export class NotFoundException extends Exception {
    constructor(entityId, entityType) {
        super(404, entityType + ' with id' + entityId + ' was not found')
    }
}
