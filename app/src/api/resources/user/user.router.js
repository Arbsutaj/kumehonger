import express from 'express';
import userController from './user.controller';
import {isAdmin} from "../../middlewares/roles-policy";
import {authentication} from "../../../config/config";

export const userRouter = express.Router();
userRouter.post('/signUp', userController.signUp);
userRouter
    .route('/:id')
    .get(isAdmin, userController.findById)
    .put(authentication.isAuthenticated(), userController.update)
    .delete(authentication.isAuthenticated(), userController.deactivateUser);
userRouter.get('/', isAdmin, userController.findAll);
