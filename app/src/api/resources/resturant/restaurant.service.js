import Joi from "joi";
import Restaurant from "./restaurant.model";
import {NotAuthorizedException} from "../exception/not-authorized-exception";
import {isValidObjectId, throwNotFoundException} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

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

async function convertRestaurantMenusImageToBase64(menusEntity) {
    let menus = [];

    for (const menu of menusEntity) {
        menus.push(await menuService.toDto(menu))
    }

    return menus;
}

async function findById(id) {
    const restaurant = await Restaurant.findById(id);
    if (restaurant)
        return {restaurant};

    return throwNotFoundException(id, entityType);
}

async function findByIdWithSpecificPopulateFields(id, populateFields) {
    const restaurant = await Restaurant.findById({_id: id}).populate(populateFields);

    return restaurant;
}

async function checkIfIsOwnerOfRestaurant(userId, restaurantId) {
    const {restaurant, notFoundException} = await findById(restaurantId);
    if (notFoundException)
        return {notFoundException};

    if (!userId.equals(restaurant.owner)) {
        const unAuthorizedException = new NotAuthorizedException('Unauthorized, user is not restaurant\'s owner!');
        return {unAuthorizedException};
    }

    return {restaurantFound: restaurant};
}

export const entityType = 'Restaurant';

function toEntity(restaurantDto) {
    return {
        name: restaurantDto.name,
        description: restaurantDto.description,
        rating: restaurantDto.rating
    };
}

async function validateRestaurantEntity(restaurant) {
    const {schema} = getValidationForRestaurantEntity();
    const {value, error} = Joi.validate(restaurant, schema);
    if (error && error.details)
        return {error};

    return {value};
}

async function toDto(restaurant, attachedPopulation) {
    let restaurantDto = {
        id: restaurant._id,
        name: restaurant.name,
        description: restaurant.description,
        rating: restaurant.rating,
        menus: restaurant.menus,
        owner: restaurant.owner
    };

    if (attachedPopulation) {
        restaurantDto = {
            id: restaurant._id,
            name: restaurant.name,
            description: restaurant.description,
            rating: restaurant.rating,
            menus: await convertRestaurantMenusImageToBase64(restaurant.menus),
            owner: restaurant.owner
        };
    }

    return {restaurantDto};
}

function toUpdateEntity(restaurantDtoUpdate) {
    return {
        name: restaurantDtoUpdate.name,
        description: restaurantDtoUpdate.description,
        rating: restaurantDtoUpdate.rating === 0 ? 0 : restaurantDtoUpdate.rating
    };
}

export default {
    validateRestaurant(body) {
        const {value, error} = validateRestaurantEntity(body);
        if (error && error.details)
            return {error};

        return {value};
    },
    async findById(id) {
        const {restaurant, notFoundException} = await findById(id);

        return {restaurant, notFoundException};
    },
    async addMenuToRestaurant(id, menu) {
        const {restaurant, notFoundException} = await findById(id);

        if (notFoundException)
            return {notFoundException};

        restaurant.menus.push(menu);
        restaurant.save();

        return {restaurant};
    },
    async findAll() {
        return Restaurant.find({});
    },
    async getRestaurantWithMenus(id) {
        const populateFields = 'menus';
        if (!isValidObjectId(id)) {
            const badParameterException = new BadParameterException('id', id);
            return {badParameterException};
        }
        const restaurant = await findByIdWithSpecificPopulateFields(id, populateFields);

        if (restaurant) {
            const {restaurantDto} = await toDto(restaurant, true);
            return {restaurant: restaurantDto};
        }

        return throwNotFoundException(id, entityType);

    },
    async findRestaurantsByOwnerId(ownerId) {
        const {restaurants} = await Restaurant.find({owner: ownerId});

        return {restaurants};
    },
    async update(id, userId, restaurantDtoUpdate) {
        let {restaurantFound, notFoundException, unAuthorizedException} = await checkIfIsOwnerOfRestaurant(userId, id);

        if (notFoundException || unAuthorizedException)
            return {notFoundException, unAuthorizedException};

        const restaurant = toUpdateEntity(restaurantDtoUpdate);
        const {value, error} = await validateRestaurantEntity(restaurant);
        if (error)
            return {error};

        restaurantFound = value;
        const restaurantUpdated = await Restaurant.findOneAndUpdate({_id: id}, restaurant, {new: true});
        const {restaurantDto} = await toDto(restaurantUpdated, false);

        return {restaurantDto}
    }

}
