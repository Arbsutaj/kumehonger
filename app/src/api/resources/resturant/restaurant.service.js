import Joi from "joi";
import Restaurant from "./restaurant.model";

function getValidationForRestaurantEntity() {
    return Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        rating: Joi.number()
            .integer()
            .min(0)
            .max(5)
            .optional(),
        menus: Joi.array().optional(),
    });
}

function findById(id, populateFields) {
    return Restaurant.findById({_id: id}).populate(populateFields);
}

export default {
    validateRestaurant(body) {
        const {schema} = getValidationForRestaurantEntity();
        const {value, error} = Joi.validate(body, schema);
        if (error && error.details)
            return {error};

        return {value};
    },
    findById(id) {
        const restaurant = findById(id);
        if (restaurant)
            return {restaurant};

        return {error: 'Restaurant with id ' +id+' not found'};
    },
    addMenuToRestaurant(id, menu) {
        const restaurantInDb = findById(id);
        restaurantInDb.menus.push(menu);
        restaurantInDb.save();
    },
    findAll() {
        return Restaurant.find();
    },
    getRestaurantWithMenus(id) {
        const populateFields = 'menus';
        const restaurant = findById(id, populateFields);

        if (restaurant)
            return {restaurant};

        return {error: 'Restaurant with id ' +id+' not found'};
    }
}
