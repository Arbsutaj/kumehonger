import Menu from "../menu/menu.model";
import restaurantService from '../resturant/restaurant.service';
import {returnExceptionResponse, returnInternalExceptionResponse} from "../../helpers/utils";

export default {
    async create(req, res) {
        try {
            const restaurantId  = req.body.restaurant;
            const menuCreated = await Menu.create(req.body);
            const {notFoundException, restaurant} = await restaurantService.addMenuToRestaurant(restaurantId, menuCreated);
            if (notFoundException)
                returnExceptionResponse(res, notFoundException);

            return res.json(menuCreated);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findOne(req, res) {
        try {
            return res.status(200).send("arbi");
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    }
}
