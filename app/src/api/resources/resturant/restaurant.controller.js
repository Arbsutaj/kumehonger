import restaurantService from './restaurant.service';
import Restaurant from './restaurant.model';

function throwError(status, res, message) {
    const error = {
        status: status,
        message: message,
    };

    return res.status(status).json(error);
}

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
            const {restaurant, error} = await restaurantService.findById(id);

            if (error)
                throwError(404, res, error);

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
                throwError(404, res, error);

            return res.status(200).json(restaurant);
        } catch (err) {
            return res.status(500).send(err);
        }
    }
}
