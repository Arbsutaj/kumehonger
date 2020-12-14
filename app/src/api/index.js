import express from 'express';
import { songRouter } from './resources/song';
import { userRouter } from './resources/user/user.router';
import { playListRouter } from './resources/playlist';
import { restaurantRouter } from "./resources/resturant";
import {menuRouter} from "./resources/menu";

export const restRouter = express.Router();
restRouter.use('/songs', songRouter);
restRouter.use('/users', userRouter);
restRouter.use('/playlist', playListRouter);
restRouter.use('/restaurant', restaurantRouter);
restRouter.use('/menu', menuRouter);
