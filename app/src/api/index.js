import express from 'express';
import {userRouter} from './resources/user/user.router';
import {restaurantRouter} from "./resources/resturant";
import {menuRouter} from "./resources/menu";

export const restRouter = express.Router();
restRouter.use('/users', userRouter);
restRouter.use('/restaurant', restaurantRouter);
restRouter.use('/menu', menuRouter);
