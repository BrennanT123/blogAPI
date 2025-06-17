import express from "express";
import * as authCtr from "../controllers/authController.js";



const authRouter = express.Router();

authRouter.post('/login', authCtr.loginUser);


authRouter.get('/authenticateSessionStrict', authCtr.authenticateUser);
authRouter.get('/authenticateSessionLoose', authCtr.authenticateUserLoose);

authRouter.get('/authenticateAdmin',authCtr.authenticateUserLoose,authCtr.authenticateAdmin);

export default authRouter;