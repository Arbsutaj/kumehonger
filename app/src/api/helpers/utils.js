import {internalException} from "../resources/exception/internal-exception";

const ObjectId = require('mongoose').Types.ObjectId;

export function isValidObjectId(id) {
    return ObjectId.isValid(id);
}

export function returnInternalException(res) {
    return res.status(internalException.status).json(internalException);
}

export function returnOkResponse(res, jsonObject) {
    return res.status(200).json(jsonObject);
}
