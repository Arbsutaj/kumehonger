import Joi from "joi";
import Restaurant from "./restaurant.model";

function getValidationForRestaurantEntity() {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        rating: Joi.number()
            .integer()
            .min(0)
            .max(5)
            .optional(),
        menus: Joi.array().optional(),
    });

    return {schema};
}

async function findById(id) {
    return Restaurant.findById(id);
}

async function findByIdWithSpecificPopulateFields(id, populateFields) {
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
    async findById(id) {
        const restaurant = await findById(id);
        if (restaurant)
            return {restaurant};

        return {error: 'Restaurant with id ' + id + ' not found'};
    },
    async addMenuToRestaurant(id, menu) {
        const restaurantInDb = await findById(id);
        restaurantInDb.menus.push(menu);
        restaurantInDb.save();
    },
    findAll() {
        return Restaurant.find();
    },
    async getRestaurantWithMenus(id) {
        const populateFields = 'menus';
        const restaurant = await findByIdWithSpecificPopulateFields(id, populateFields);

        if (restaurant)
            return {restaurant};

        return {error: 'Restaurant with id ' + id + ' not found'};
    }
}
