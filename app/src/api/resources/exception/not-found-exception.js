export class NotFoundException{
    constructor(entityId, entityType) {
        this.entityId = entityId;
        this.entityType = entityType;
        this.statusCode = 404;
    }

    getJsonNotFoundExceptionMessage() {
        return {status: this.statusCode, statusDescription: 'Bad Request', message: this.entityType + ' with id' + this.entityId + ' was not found'};
    }
}
