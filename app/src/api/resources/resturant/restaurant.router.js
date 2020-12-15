import express from "express";
import restaurantController from "./restaurant.controller";
import {authentication} from "../../../config/config";

export const restaurantRouter = express.Router();
restaurantRouter.post('/', authentication.isAuthenticated(), restaurantController.create);
restaurantRouter.get('/:id', authentication.isAuthenticated(), restaurantController.findById);
