import restaurantService from './restaurant.service';
import Restaurant from './restaurant.model';
import {
    isValidObjectId,
    returnExceptionResponse,
    returnInternalExceptionResponse,
    returnOkResponse
} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async create(req, res) {
        try {
            const {value, error} = restaurantService.validateRestaurant(req.body);

            if (error && error.details)
                return res.status(400).json(error);

            const restaurantToCreate = Object.assign({}, value, {owner: req.user._id});
            const restaurantCreated = await Restaurant.create(restaurantToCreate);

            returnOkResponse(res, restaurantCreated);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                returnExceptionResponse(res, error);
            }

            const {restaurant, notFoundException} = await restaurantService.findById(id);
            if (notFoundException)
                returnExceptionResponse(res, notFoundException);

            returnOkResponse(res, restaurant);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findByIdAndRetrieveMenus(req, res) {
        try {
            const {id} = req.params;
            const {restaurant, notFoundException, badParameterException} = await restaurantService.getRestaurantWithMenus(id);

            if (notFoundException || badParameterException) {
                if (badParameterException)
                    returnExceptionResponse(res, badParameterException);

                returnExceptionResponse(res, notFoundException);
            }

            returnOkResponse(res, restaurant);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findAll(req, res) {
        try {
            const restaurants = await restaurantService.findAll();
            returnOkResponse(res, restaurants);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;

            const {restaurantDto, notFoundException, unAuthorizedException, error} = await restaurantService.update(id, req.user._id, req.body);
            if (notFoundException || unAuthorizedException || error) {
                if (notFoundException)
                    returnExceptionResponse(res, notFoundException);

                if (unAuthorizedException)
                    returnExceptionResponse(res, unAuthorizedException);

                if (error)
                    return res.status(400).json(error);
            }

            returnOkResponse(res, restaurantDto);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    }
}
