import express from "express";
import * as usersCtrl from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post('/',usersCtrl.createUser);

export default usersRouter