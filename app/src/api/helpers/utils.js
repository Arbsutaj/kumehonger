import {InternalException} from "../resources/exception/internal-exception";
import {NotFoundException} from "../resources/exception/not-found-exception";
import {entityType} from "../resources/resturant/restaurant.service";
import {NotAuthorizedException} from "../resources/exception/not-authorized-exception";

const ObjectId = require('mongoose').Types.ObjectId;

export function isValidObjectId(id) {
    return ObjectId.isValid(id);
}

export function internalExceptionResponse(res) {
    const internalException = new InternalException();
    return res.status(internalException.statusCode).json(internalException);
}

export function okResponse(res, jsonObject) {
    return res.status(200).json(jsonObject);
}

export function exceptionResponse(res, exception) {
    return res.status(res.statusCode).json(exception);
}

export function validationExceptionResponse(res, exception) {
    return res.status(400).json(exception);
}

export function throwNotFoundException(id, entityType) {
    const notFoundException = new NotFoundException(id, entityType);
    return {notFoundException};
}

export function throwNotAuthorizedException(message) {
    const notAuthorizedException = new NotAuthorizedException(message);
    return {notAuthorizedException};
}