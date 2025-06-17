import express from "express";
import * as usersCtrl from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post('/',usersCtrl.createUser);
usersRouter.post('/postUserData',usersCtrl.postUserData);
usersRouter.get('/getLoggedInName',usersCtrl.getLoggedInUserName);
export default usersRouter