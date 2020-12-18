import express from "express";
import restaurantController from "./restaurant.controller";
import {authentication} from "../../../config/config";

export const restaurantRouter = express.Router();
restaurantRouter
    .route('/')
    .post(authentication.isAuthenticated(), restaurantController.create)
    .get(authentication.isAuthenticated(), restaurantController.findAll);
restaurantRouter
    .route('/:id')
    .get(authentication.isAuthenticated(), restaurantController.findById)
    .put(authentication.isAuthenticated(), restaurantController.update);
restaurantRouter
    .get('/:id/with-menu', authentication.isAuthenticated(), restaurantController.findByIdAndRetrieveMenus);
