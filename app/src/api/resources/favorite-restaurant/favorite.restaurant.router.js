import express from 'express';
import {authentication} from "../../../config/config";
import favoriteRestaurantController from './favorite.restaurant.controller';

export const favoriteRestaurantRouter = express.Router();
favoriteRestaurantRouter
    .route('/')
    .post(authentication.isAuthenticated(), favoriteRestaurantController.create);
favoriteRestaurantRouter
    .route('/by-user-id/:userId')
    .get(authentication.isAuthenticated(), favoriteRestaurantController.findByUserId);
favoriteRestaurantRouter
    .route('/logged-in-user')
    .get(authentication.isAuthenticated(), favoriteRestaurantController.findByLoggedInUser);
favoriteRestaurantRouter
    .route('/with-restaurant/logged-in')
    .get(authentication.isAuthenticated(), favoriteRestaurantController.findByLoggedInUserAndIncludeRestaurants);
favoriteRestaurantRouter
    .route('/:id')
    .delete(authentication.isAuthenticated(), favoriteRestaurantController.delete);
