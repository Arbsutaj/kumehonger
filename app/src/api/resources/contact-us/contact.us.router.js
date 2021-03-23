import express from "express";
import contactUsController from "./contact.us.controller";

export const contactUsRouter = express.Router();
contactUsRouter
    .post('/', contactUsController.create)
