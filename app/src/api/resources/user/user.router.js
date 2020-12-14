import express from 'express';
import passport from 'passport';
import userController from './user.controller';

export const userRouter = express.Router();
userRouter.post('/signUp', userController.signUp);
userRouter.post('/login', userController.login);
userRouter.get('/me', passport.authenticate('jwt', { session: false }), userController.authenticate);
