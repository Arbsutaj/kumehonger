import restaurantService from './restaurant.service';
import Restaurant from './restaurant.model';
import {isValidObjectId, returnInternalException, returnOkResponse} from "../../helpers/utils";
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
            returnInternalException(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)){
                const error = new BadParameterException('id', id);

                return res.status(error.statusCode).json(error.getJsonBadParameterExceptionMessage());
            }

            const {restaurant, error} = await restaurantService.findById(id);
            if (error)
               return res.status(error.statusCode).json(error.getJsonNotFoundException());

            returnOkResponse(res, restaurant);
        } catch (err) {
            returnInternalException(res);
        }
    },
    async findByIdAndRetrieveMenus(req, res) {
        try {
            const {id} = req.params;
            const {restaurant, error} = await restaurantService.getRestaurantWithMenus(id);

            if (error)
                res.status(error.status).json(error.getJsonNotFoundException());

            returnOkResponse(res, restaurant);
        } catch (err) {
            returnInternalException(res);
        }
    },
    async findAll(req, res) {
        try {
            const restaurants = await restaurantService.findAll();
            returnOkResponse(res, restaurants);
        } catch(err) {
            returnInternalException(res);
        }
    }
}
