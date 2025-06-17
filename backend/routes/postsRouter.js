import express from "express";
import * as postCtr from "../controllers/postsController.js";
import * as authCtr from "../controllers/authController.js";



const postsRouter = express.Router();

postsRouter.post("/newPost",authCtr.authenticateUser, authCtr.authenticateAdminStrict, postCtr.createPost);
postsRouter.get("/", postCtr.getPosts);
postsRouter.delete("/delete",postCtr.deletePost);
postsRouter.put("/update",authCtr.authenticateUser, postCtr.updatePost);
postsRouter.post("/newComment",authCtr.authenticateUserLoose,postCtr.createNewComment);


export default postsRouter;