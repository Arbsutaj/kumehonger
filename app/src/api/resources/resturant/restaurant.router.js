import express from "express";
import restaurantController from "./restaurant.controller";
import passport from "passport";

export const restaurantRouter = express.Router();
restaurantRouter.post('/', passport.authenticate('jwt', { session: false }), restaurantController.create);
restaurantRouter.get('/:id', passport.authenticate('jwt', { session: false }), restaurantController.findOne);
