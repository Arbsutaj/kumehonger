import {InternalException} from "../resources/exception/internal-exception";
import {NotFoundException} from "../resources/exception/not-found-exception";
import {entityType} from "../resources/resturant/restaurant.service";
const ObjectId = require('mongoose').Types.ObjectId;

export function isValidObjectId(id) {
    return ObjectId.isValid(id);
}

export function returnInternalExceptionResponse(res) {
    const internalException = new InternalException();
    return res.status(internalException.statusCode).json(internalException);
}

export function returnOkResponse(res, jsonObject) {
    return res.status(200).json(jsonObject);
}

export function returnExceptionResponse(res, exception) {
    return res.status(res.statusCode).json(exception);
}

export function throwNotFoundException(id, entityType) {
    const notFoundException = new NotFoundException(id, entityType);
    return {notFoundException};
}
