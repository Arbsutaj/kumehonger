import restaurantCommentService from "../comment/restaurant.comment.service";
import {
    exceptionResponse,
    internalExceptionResponse,
    isValidObjectId,
    okResponse,
    validationExceptionResponse
} from "../../../helpers/utils";
import {BadParameterException} from "../../exception/bad-parameter-exception";

export default {
    async addComment(req, res) {
        try {
            let restaurantComment = req.body;

            restaurantComment = Object.assign({}, restaurantComment, { user: req.user._id});
            const {notFoundException, commentInDb} = await restaurantCommentService.addComment(restaurantComment);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, commentInDb);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async removeComment(req, res) {
        try {
            const {id} = req.params;

            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            const {notFoundException, success} = await restaurantCommentService.removeComment(id);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, success);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findAllRestaurantsComments(req, res) {
        try {
            const {id} = req.params;

            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            return okResponse(res, await restaurantCommentService.findAllRestaurantsComments(id));
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async updateComment(req, res) {
        try {
            const restaurantComment = req.body;
            const userId = req.user._id;
            const {id} = req.params;

            const {commentUpdated, notFoundException, unAuthorizedException, error} = await restaurantCommentService.update(id, userId, restaurantComment);
            if (notFoundException || unAuthorizedException || error) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);

                if (unAuthorizedException)
                    return exceptionResponse(res, unAuthorizedException);

                if (error)
                    return validationExceptionResponse(res, error);
            }

            return okResponse(res, commentUpdated);

        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findCommentsByRestaurantIdPaginated(req, res) {
        try {
            const {id} = req.params;
            const {page, limit} = req.query;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 6,
                sort : {
                    createdAt: -1
                }
            };

            const {restaurantComments} = await restaurantCommentService.findCommentsByRestaurantIdPaginated(id, options);

            return okResponse(res, restaurantComments);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findById(req, res) {

    }
}
