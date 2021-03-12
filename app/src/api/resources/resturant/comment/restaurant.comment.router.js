import express from "express";
import restaurantCommentController from "../comment/restaurant.comment.controller";
import {authentication} from "../../../../config/config";

export const restaurantCommentRouter = express.Router();
restaurantCommentRouter
    .route('/:id')
    .get(authentication.isAuthenticated(), restaurantCommentController.findById)
    .put(authentication.isAuthenticated(), restaurantCommentController.updateComment)
    .delete(authentication.isAuthenticated(), restaurantCommentController.removeComment);
restaurantCommentRouter
    .route('/by-restaurant/:id')
    .get(authentication.isAuthenticated(), restaurantCommentController.findAllRestaurantsComments)
restaurantCommentRouter
    .post('/add', authentication.isAuthenticated(), restaurantCommentController.addComment);
restaurantCommentRouter
    .get('/by-restaurant-paginated/:id', restaurantCommentController.findCommentsByRestaurantIdPaginated);
