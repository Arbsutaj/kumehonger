import express from "express";
import menuController from "./menu.controller";
import {authentication} from "../../../config/config";

export const menuRouter = express.Router();
menuRouter
    .post('/', authentication.isAuthenticated(), menuController.create)
    .post('/list-of-menu', authentication.isAuthenticated(), menuController.addListOfMenuToRestaurant)
menuRouter
    .route('/:id')
    .delete(authentication.isAuthenticated(), menuController.delete);
menuRouter
    .route('/of-the-week')
    .put(menuController.getRestaurantsWeeklyMenu)
    .post(authentication.isAuthenticated(), menuController.addMenuOfTheWeek);

