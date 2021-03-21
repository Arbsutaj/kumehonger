import Menu from "./menu.model";
import restaurantService from "../resturant/restaurant.service";
import {exceptionResponse, okResponse, throwNotFoundException, toBase64} from "../../helpers/utils";

async function toDto(menuEntity) {
    return {
        id: menuEntity._id,
        restaurant: menuEntity.restaurant,
        servingTime: menuEntity.servingTime,
        category: menuEntity.category,
        ingredients: menuEntity.ingredients,
        image: {data: toBase64(menuEntity.image.data), contentType: menuEntity.image.contentType},
        price: menuEntity.price,
        title: menuEntity.title,
        isMenuOfTheWeek: menuEntity.isMenuOfTheWeek
    }
}
export default {
    async toDto(menu) {
        return await toDto(menu);
    },
    async delete(id, userId) {
        const menu = await Menu.findOne({_id: id});

        if (!menu)
            return throwNotFoundException(id, 'Menu');

        const {success, notFoundException, notAuthorizedException} = await restaurantService.removeMenuFromRestaurant(menu.restaurant, userId, id);
        if (notFoundException || notAuthorizedException) {
            if (notFoundException)
                return {notFoundException}

            return {notAuthorizedException}
        }

        await Menu.deleteOne({_id: id});

        return {success};
    },
    async addMenuOfTheWeek(menuOfTheWeek) {
        const menu = await Menu.findById(menuOfTheWeek.id);

        await Menu.updateMany({restaurant: menuOfTheWeek.restaurant}, {$set: {isMenuOfTheWeek: false}});
        menu.isMenuOfTheWeek = true;
        await menu.save();

        return {menu: await toDto(menu)};
    },
    async findMenusOfTheWeekOfRestaurants(restaurantIds) {
        const menus = await Menu.find({restaurant: { "$in" : restaurantIds}, isMenuOfTheWeek: true});

        let menuDtos = [];
        for (let i = 0; i < menus.length; i++) {
            menuDtos.push(await toDto(menus[i]));
        }

        return menuDtos;
    }
}
