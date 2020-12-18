import express from 'express';
import {userRouter} from './resources/user/user.router';
import {menuRouter} from "./resources/menu/menu.router";
import {restaurantRouter} from "./resources/resturant/restaurant.router";
import {authenticationRouter} from "./resources/authentication/authentication.router";
import {favoriteRestaurantRouter} from "./resources/favorite-restaurant/favorite.restaurant.router";

export const restRouter = express.Router();
restRouter.use('/auth', authenticationRouter);
restRouter.use('/users', userRouter);
restRouter.use('/restaurant', restaurantRouter);
restRouter.use('/menu', menuRouter);
restRouter.use('/favorite-restaurant', favoriteRestaurantRouter);
