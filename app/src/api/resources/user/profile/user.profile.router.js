import express from 'express';
import userProfileController from "./user.profile.controller";
import {authentication} from "../../../../config/config";

export const userProfileRouter = express.Router();
userProfileRouter
    .post('/', authentication.isAuthenticated(), userProfileController.create)
    .get('/my', authentication.isAuthenticated(), userProfileController.findLoggedInUserProfile);
userProfileRouter
    .route('/:id')
    .get(authentication.isAuthenticated(), userProfileController.findByUserId)
    .put(authentication.isAuthenticated(), userProfileController.update)
