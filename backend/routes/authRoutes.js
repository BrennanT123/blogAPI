import express from "express";
import * as authCtr from "../controllers/authController.js";



const authRouter = express.Router();

authRouter.get('/', authCtr.loginUser);


//authRouter.get('/authenticateSession', authCtr.authenticateUser);



export default authRouter;