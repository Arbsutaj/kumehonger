import Menu from "../menu/menu.model";
import restaurantService from '../resturant/restaurant.service';
import {
    exceptionResponse,
    internalExceptionResponse,
    isValidObjectId,
    okResponse,
    toBinaryData
} from "../../helpers/utils";
import menuService from "./menu.service";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async create(req, res) {
        try {
            const restaurantId = req.body.restaurant;
            const menuToCreate = Object.assign({}, req.body, {
                image: {
                    data: toBinaryData(req.body.image.data),
                    contentType: req.body.image.contentType
                }
            });
            const menuCreated = await Menu.create(menuToCreate);
            const {
                notFoundException,
                restaurant
            } = await restaurantService.addMenuToRestaurant(restaurantId, menuCreated);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, await menuService.toDto(menuCreated));
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async delete(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user._id;

            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            const {notFoundException, success} = await menuService.delete(id, userId);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, success);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async addListOfMenuToRestaurant(req, res) {
        try {
            let menus = req.body;
            let menusEntities = [];

            menus.forEach(menu => {
                const menuEntity = Object.assign({}, menu, {
                    image: {
                        data: toBinaryData(menu.image.data),
                        contentType: menu.image.contentType
                    }
                });

                menusEntities.push(menuEntity);
            });

            let menusCreated = [];
            Menu.deleteMany({restaurant: menus[0].restaurant});
            for (const menu of menusEntities) {
                const menuInDb = await Menu.create(menu);
                menusCreated.push(menuInDb);
            }

            const {
                notFoundException,
                restaurant
            } = await restaurantService.addMenusToRestaurant(menusCreated);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            let menusCreatedDtos = [];
            for (const menuCreated of menusCreated) {
                menusCreatedDtos.push(await menuService.toDto(menuCreated));
            }

            return okResponse(res, menusCreatedDtos);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async addMenuOfTheWeek(req, res) {
        try {
            const menuOfTheWeek = req.body;

            const {menu, notFoundException} = await menuService.addMenuOfTheWeek(menuOfTheWeek);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, menu);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async getRestaurantsWeeklyMenu(req, res) {
        try {
            const restaurantIds = req.body.restaurants;

            const menus = await menuService.findMenusOfTheWeekOfRestaurants(restaurantIds);

            return okResponse(res, menus);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    }
}
