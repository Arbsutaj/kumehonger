import restaurantService from './restaurant.service';
import Restaurant from './restaurant.model';
import {isValidObjectId} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async create(req, res) {
        try {
            const {value, error} = restaurantService.validateRestaurant(req.body);

            if (error && error.details)
                return res.status(400).json(error);

            const restaurantToCreate = Object.assign({}, value, {owner: req.user._id});
            const restaurantCreated = await Restaurant.create(restaurantToCreate);

            return res.json(restaurantCreated);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
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

            return res.status(200).json(restaurant);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async findByIdAndRetrieveMenus(req, res) {
        try {
            const {id} = req.params;
            const {restaurant, error} = await restaurantService.getRestaurantWithMenus(id);

            if (error)
                res.status(error.status).json(error.getJsonNotFoundException());

            return res.status(200).json(restaurant);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async findAll(req, res) {
        try {
            const restaurants = await restaurantService.findAll();
            return res.status(200).json(restaurants);
        } catch(err) {

        }
    }
}
