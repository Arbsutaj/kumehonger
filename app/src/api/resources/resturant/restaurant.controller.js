import restaurantService from './restaurant.service';
import Restaurant from './restaurant.model';
import {
    exceptionResponse,
    internalExceptionResponse,
    isValidObjectId,
    okResponse,
    toBinaryData,
    validationExceptionResponse
} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async create(req, res) {
        try {
            const {value, error} = await restaurantService.validateRestaurant(req.body);

            if (error && error.details)
                return validationExceptionResponse(res, error);

            const restaurantToCreate = Object.assign({}, value, {
                owner: req.user._id,
                logo: toBinaryData(req.body.logo),
                createdAt: Date.now()
            });
            const restaurantCreated = await Restaurant.create(restaurantToCreate);

            return okResponse(res, await restaurantService.toDto(restaurantCreated));
        } catch (err) {
            console.log(err);
            return internalExceptionResponse(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            const {restaurant, notFoundException} = await restaurantService.findById(id);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, await restaurantService.toDto(restaurant));
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findByIdAndRetrieveMenus(req, res) {
        try {
            const {id} = req.params;
            const {
                restaurant,
                notFoundException,
                badParameterException
            } = await restaurantService.getRestaurantWithMenus(id);

            if (notFoundException || badParameterException) {
                if (badParameterException)
                    return exceptionResponse(res, badParameterException);

                return exceptionResponse(res, notFoundException);
            }

            return okResponse(res, restaurant);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findAll(req, res) {
        try {
            const {restaurants} = await restaurantService.findAll();

            return okResponse(res, restaurants);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findAllPagination(req, res) {
        try {
            const {page, limit, sort} = req.query;
            let sortByOption = {};
            let ascending = -1;
            if (sort) {
                const sortBy = sort.split(',');

                if (sortBy[0] === 'likes') {
                    if (sortBy[1] !== 'asc')
                        ascending = 1;

                    sortByOption = {likes: ascending};
                }

                if (sortBy[0] === 'createdAt') {
                    const sortBy = sort.split(',');
                    if (sortBy[1] !== 'asc')
                        ascending = 1;

                    sortByOption = {createdAt: ascending};
                }
            }


            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
                sort: sortByOption
            };

            const {restaurants} = await restaurantService.findAllPagination(options);

            return okResponse(res, restaurants);
        } catch (err) {
            console.log(err);
            return internalExceptionResponse(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;

            const {
                restaurantDto,
                notFoundException,
                unAuthorizedException,
                error
            } = await restaurantService.update(id, req.user._id, req.body);
            if (notFoundException || unAuthorizedException || error) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);

                if (unAuthorizedException)
                    return exceptionResponse(res, unAuthorizedException);

                if (error)
                    return validationExceptionResponse(res, error);
            }

            return okResponse(res, restaurantDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findNearByRestaurants(req, res) {
        try {
            let lat = req.body.lat;
            let lang = req.body.lng;
            let restaurants = await Restaurant.find({
                location: {
                    $near: {
                        $maxDistance: 4,
                        $geometry: {
                            type: "Point",
                            coordinates: [lat, lang]
                        }
                    }
                }
            });

            return okResponse(res, restaurants);
        } catch (err) {
            return internalExceptionResponse(res)
        }
    },
    async likeRestaurant(req, res) {
        try {
            let userLikeRestaurant = {restaurant: req.body.restaurant};

            userLikeRestaurant = Object.assign({}, userLikeRestaurant, {user: req.user._id});

            const {
                userLikeRestaurantInDb,
                notFoundException
            } = await restaurantService.likeRestaurant(userLikeRestaurant);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, userLikeRestaurantInDb);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async removeLikeFromRestaurant(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user._id;

            const {success, notFoundException, notAuthorizedException} = await restaurantService.removeLike(id, userId);
            if (notFoundException || notAuthorizedException) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);

                if (notAuthorizedException)
                    return exceptionResponse(res, notAuthorizedException);
            }

            return okResponse(res, success);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findLikesOfLoggedInUser(req, res) {
        try {
            const userId = req.user._id;
            const restaurantsLikedByUser = await restaurantService.findLikesOfUser(userId);

            return okResponse(res, restaurantsLikedByUser);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findRestaurantByName(req, res) {
        try {
            const name = req.query.name;
            const {restaurants} = await restaurantService.findRestaurantsByName(name);

            return okResponse(res, restaurants);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async deleteRestaurant(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user._id;

            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            const {
                notFoundException,
                success,
                notAuthorizedException
            } = await restaurantService.deleteRestaurant(id, userId);
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
