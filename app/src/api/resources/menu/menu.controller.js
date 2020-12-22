import Menu from "../menu/menu.model";
import restaurantService from '../resturant/restaurant.service';
import {exceptionResponse, internalExceptionResponse, okResponse, toBinaryData} from "../../helpers/utils";
import menuService from "./menu.service";

export default {
    async create(req, res) {
        try {
            const restaurantId  = req.body.restaurant;
            const menuToCreate = Object.assign({}, req.body, {image: {data: toBinaryData(req.body.image.data), contentType: req.body.image.contentType}});
            const menuCreated = await Menu.create(menuToCreate);
            const {notFoundException, restaurant} = await restaurantService.addMenuToRestaurant(restaurantId, menuCreated);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, await menuService.toDto(menuCreated));
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findOne(req, res) {
        try {
            return res.status(200).send("arbi");
        } catch (err) {
            return internalExceptionResponse(res);
        }
    }
}
