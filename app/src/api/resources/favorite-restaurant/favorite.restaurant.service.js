import restaurantService from "../resturant/restaurant.service";
import FavoriteRestaurant from './favorite.restaurant.model';
import {throwNotAuthorizedException, throwNotFoundException} from "../../helpers/utils";

async function findById(id) {
    const favoriteRestaurant = await FavoriteRestaurant.findById(id);

    if (!favoriteRestaurant)
        return throwNotFoundException(id, entityType);

    return {favoriteRestaurant: favoriteRestaurant};
}
export const entityType = 'User\'s favorite restaurant';
export default {
    async create(userId, usersFavoriteRestaurant) {
        const {restaurant, notFoundException} = await restaurantService.findById(usersFavoriteRestaurant.restaurant);

        if (notFoundException)
            return {notFoundException};

        const usersFavoriteRestaurantEntity = Object.assign({}, usersFavoriteRestaurant, {user: userId});
        const usersFavoriteRestaurantCreated = await FavoriteRestaurant.create(usersFavoriteRestaurantEntity);

        return {usersFavoriteRestaurantCreated};
    },
    async findByUserId(userId) {
        const usersFavoriteRestaurants = await FavoriteRestaurant.find({user: userId});

        return {usersFavoriteRestaurants};
    },
    async delete(userId, id) {
        const {favoriteRestaurant, notFoundException} = await findById(id);

        if (notFoundException)
            return {notFoundException};

        if (!userId.equals(favoriteRestaurant.user)) {
            const {notAuthorizedException} = throwNotAuthorizedException('Cannot delete another user\'s favorite restaurant!');

            return {notAuthorizedException};
        }

        await FavoriteRestaurant.deleteOne({_id: id});
        return {success: {success: true}};
    }
}
