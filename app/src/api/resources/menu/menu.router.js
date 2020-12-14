import express from "express";
import menuController from "./menu.controller";
import passport from "passport";

export const menuRouter = express.Router();
menuRouter.post('/', passport.authenticate('jwt', { session: false }), menuController.create);
