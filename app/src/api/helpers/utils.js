const ObjectId = require('mongoose').Types.ObjectId;

export function isValidObjectId(id) {
    return ObjectId.isValid(id);
}
