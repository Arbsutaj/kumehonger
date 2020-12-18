import express from "express";
import {authentication} from "../../../config/config";
import authenticationController from './authentication.controller';

export const authenticationRouter = express.Router();
authenticationRouter.post('/login', authenticationController.login);
authenticationRouter.get('/me', authentication.isAuthenticated(), authenticationController.getLoggedInUser);
