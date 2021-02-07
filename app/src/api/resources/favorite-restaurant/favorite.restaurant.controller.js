import favoriteRestaurantService from './favorite.restaurant.service';
import {
    okResponse,
    exceptionResponse,
    internalExceptionResponse,
} from "../../helpers/utils";

export default {
    async create(req, res) {
        try {
            const userId = req.user._id;
            const usersFavoriteRestaurantRequest = req.body;

            const {usersFavoriteRestaurantCreated, notFoundException} = await favoriteRestaurantService.create(userId, usersFavoriteRestaurantRequest);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, usersFavoriteRestaurantCreated);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findByUserId(req, res) {
        try {
            const {userId} = req.params;
            const {usersFavoriteRestaurants} = await favoriteRestaurantService.findByUserId(userId);

            return okResponse(res, usersFavoriteRestaurants);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findByLoggedInUser(req, res) {
        try {
            const userId = req.user._id;
            const {usersFavoriteRestaurants} = await favoriteRestaurantService.findByUserId(userId);

            return okResponse(res, usersFavoriteRestaurants);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async delete(req, res) {
        try {
            const userId = req.user._id;
            const {id} = req.params;
            const {success, notFoundException, notAuthorizedException} = await favoriteRestaurantService.delete(userId, id);

            if (notFoundException || notAuthorizedException) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);

                return exceptionResponse(res, notAuthorizedException);
            }

            return okResponse(res, success);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    }
}
