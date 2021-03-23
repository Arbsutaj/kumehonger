import Joi from "joi";
import Restaurant from "./restaurant.model";
import {NotAuthorizedException} from "../exception/not-authorized-exception";
import {
    isValidObjectId,
    throwNotAuthorizedException,
    throwNotFoundException,
    toBase64,
    toBinaryData
} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";
import menuService from "../menu/menu.service";
import UserLikeRestaurant from "./user.like.restaurant.model";

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
        logo: Joi.binary().optional(),
        location: Joi.object().optional(),
        opensAt: Joi.string().required(),
        closesAt: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        createdAt: Joi.date().optional()
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
    return await Restaurant.findById({_id: id}).populate(populateFields);
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

async function toRestaurantsPagingDto(pagingEntity, restaurants) {
    return {
        restaurants: restaurants,
        page: pagingEntity.page,
        limit: pagingEntity.limit,
        total: pagingEntity.total,
        pages: pagingEntity.pages
    };
}

async function toDto(restaurant, attachedPopulation) {
    let restaurantDto = {
        id: restaurant._id,
        name: restaurant.name,
        description: restaurant.description,
        rating: restaurant.rating,
        menus: restaurant.menus,
        owner: restaurant.owner,
        logo: toBase64(restaurant.logo),
        location: restaurant.location,
        closesAt: restaurant.closesAt,
        opensAt: restaurant.opensAt,
        likes: restaurant.likes,
        numberOfComments: restaurant.numberOfComments,
        street: restaurant.street,
        city: restaurant.city,
        address: restaurant.address
    };

    if (attachedPopulation) {
        restaurantDto = {
            id: restaurant._id,
            name: restaurant.name,
            description: restaurant.description,
            rating: restaurant.rating,
            menus: await convertRestaurantMenusImageToBase64(restaurant.menus),
            owner: restaurant.owner,
            logo: toBase64(restaurant.logo),
            location: restaurant.location,
            closesAt: restaurant.closesAt,
            opensAt: restaurant.opensAt,
            likes: restaurant.likes,
            numberOfComments: restaurant.numberOfComments,
            street: restaurant.street,
            city: restaurant.city,
            address: restaurant.address
        };
    }

    return restaurantDto;
}

function toUpdateEntity(restaurantDtoUpdate) {
    return {
        name: restaurantDtoUpdate.name,
        description: restaurantDtoUpdate.description,
        rating: restaurantDtoUpdate.rating === 0 ? 0 : restaurantDtoUpdate.rating,
        opensAt: restaurantDtoUpdate.opensAt,
        closesAt: restaurantDtoUpdate.closesAt,
        logo: toBinaryData(restaurantDtoUpdate.logo),
        location: restaurantDtoUpdate.location,
        city: restaurantDtoUpdate.city,
        street: restaurantDtoUpdate.street
    };
}

export default {
    async validateRestaurant(body) {
        const {value, error} = await validateRestaurantEntity(body);
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
        const restaurantsDto = [];
        const restaurants = await Restaurant.find({});
        if (restaurants)
            for (let restaurant of restaurants) {
                restaurantsDto.push(await toDto(restaurant, false));
            }

        return {restaurants: restaurantsDto};
    },
    async findAllPagination(options) {
        const restaurantsDto = [];
        let restaurants = await Restaurant.paginate({}, options);
        for (let i = 0; i < restaurants.docs.length; i++) {
            restaurantsDto.push(await toDto(restaurants.docs[i]));
        }

        return {restaurants: await toRestaurantsPagingDto(restaurants, restaurantsDto)};
    },
    async getRestaurantWithMenus(id) {
        const populateFields = 'menus';
        if (!isValidObjectId(id)) {
            const badParameterException = new BadParameterException('id', id);
            return {badParameterException};
        }
        const restaurant = await findByIdWithSpecificPopulateFields(id, populateFields);

        if (restaurant) {
            const restaurantDto = await toDto(restaurant, true);
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
        const restaurantDto = await toDto(restaurantUpdated, false);

        return {restaurantDto};
    },
    async likeRestaurant(userLikeRestaurant) {
        const restaurantId = userLikeRestaurant.restaurant;

        const {restaurant, notFoundException} = await findById(restaurantId);
        if (notFoundException)
            return {notFoundException};

        let userLikeRestaurantInDb = await UserLikeRestaurant.find({
            restaurant: restaurantId,
            user: userLikeRestaurant.user
        });
        if (userLikeRestaurantInDb.length === 0) {
            restaurant.likes = restaurant.likes + 1;
            await Restaurant.findOneAndUpdate({_id: restaurantId}, restaurant, {new: true});
            userLikeRestaurantInDb = await UserLikeRestaurant.create(userLikeRestaurant);
        }

        return {userLikeRestaurantInDb};
    },
    async removeLike(id, userId) {
        const userLikeRestaurantInDb = await UserLikeRestaurant.findById(id);
        if (!userLikeRestaurantInDb)
            return throwNotFoundException(id, 'Like');

        if (!userId.equals(userLikeRestaurantInDb.user))
            return throwNotAuthorizedException('User cannot remove other\'s like');

        await UserLikeRestaurant.deleteOne({_id: id});
        const {restaurant} = await findById(userLikeRestaurantInDb.restaurant);
        restaurant.likes = restaurant.likes - 1;
        await Restaurant.findOneAndUpdate({_id: restaurant._id}, restaurant, {new: true});
        return {success: {success: true}};
    },
    async findLikesOfUser(userId) {
        return await UserLikeRestaurant.find({user: userId});
    },
    async findRestaurantsByName(name) {
        const nameRegex = new RegExp("^" + name, "i");
        const restaurants = await Restaurant.find({name: nameRegex}, { name: 1 });

        return {restaurants};
    },
    async deleteRestaurant(id, userId) {
        let {restaurantFound, notFoundException, unAuthorizedException} = await checkIfIsOwnerOfRestaurant(userId, id);

        if (notFoundException || unAuthorizedException)
            return {notFoundException, unAuthorizedException};

        await Restaurant.deleteOne({_id: id});

        return {success: {success: true}};
    },
    async removeMenuFromRestaurant(id, userId, menuId) {
        let {restaurantFound, notFoundException, unAuthorizedException} = await checkIfIsOwnerOfRestaurant(userId, id);

        if (notFoundException || unAuthorizedException)
            return {notFoundException, unAuthorizedException};

        restaurantFound.menus.pull({_id: menuId});
        restaurantFound.save();
        return {success: {success: true}};
    },
    async toDto(entity) {
        return await toDto(entity, false);
    },
    async addMenusToRestaurant(menus) {
        const {restaurant, notFoundException} = await findById(menus[0].restaurant);

        if (notFoundException)
            return {notFoundException};

        restaurant.menus = [];
        menus.forEach(menu => restaurant.menus.push(menu));
        await restaurant.save();

        return {restaurant};
    }
}
