import express from "express";
import menuController from "./menu.controller";
import {authentication} from "../../../config/config";

export const menuRouter = express.Router();
menuRouter.post('/', authentication.isAuthenticated(), menuController.create);
