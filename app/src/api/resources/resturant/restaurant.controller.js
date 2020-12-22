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
                logo: toBinaryData(req.body.logo)
            });
            const restaurantCreated = await Restaurant.create(restaurantToCreate);

            return okResponse(res, await restaurantService.toDto(restaurantCreated));
        } catch (err) {
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
            const {restaurant, notFoundException, badParameterException} = await restaurantService.getRestaurantWithMenus(id);

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
            const {page, limit} = req.query;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
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

            const {restaurantDto, notFoundException, unAuthorizedException, error} = await restaurantService.update(id, req.user._id, req.body);
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
    }
}
