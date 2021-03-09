import express from "express";
import restaurantController from "./restaurant.controller";
import {authentication} from "../../../config/config";

export const restaurantRouter = express.Router();
restaurantRouter
    .route('/')
    .post(authentication.isAuthenticated(), restaurantController.create)
    .get(authentication.isAuthenticated(), restaurantController.findAll);
restaurantRouter
    .route('/by-id/:id')
    .get(authentication.isAuthenticated(), restaurantController.findById)
    .put(authentication.isAuthenticated(), restaurantController.update);
restaurantRouter
    .get('/:id/with-menu', authentication.isAuthenticated(), restaurantController.findByIdAndRetrieveMenus)
    .get('/paginated', authentication.isAuthenticated(), restaurantController.findAllPagination);
restaurantRouter
    .post('/find-nearby-restaurants', authentication.isAuthenticated(), restaurantController.findNearByRestaurants);
restaurantRouter
    .post('/like', authentication.isAuthenticated(), restaurantController.likeRestaurant)
    .get('/my-liked-restaurants', authentication.isAuthenticated(), restaurantController.findLikesOfLoggedInUser)
    .delete('/remove-like/:id', authentication.isAuthenticated(), restaurantController.removeLikeFromRestaurant);
