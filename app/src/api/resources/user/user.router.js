import express from 'express';
import userController from './user.controller';
import {authentication} from "../../../config/config";

export const userRouter = express.Router();
userRouter.post('/signUp', userController.signUp);
userRouter.post('/login', userController.login);
userRouter.get('/me', authentication.isAuthenticated(), userController.authenticate);
