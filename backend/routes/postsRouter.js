import express from "express";
import * as postCtr from "../controllers/postsController.js";
import * as authCtr from "../controllers/authController.js";



const postsRouter = express.Router();

postsRouter.post("/newPost",authCtr.authenticateUser, authCtr.authenticateAdminStrict, postCtr.createPost);
postsRouter.get("/", postCtr.getPosts);
postsRouter.delete("/delete",authCtr.authenticateUser, authCtr.authenticateAdminStrict,postCtr.deletePost);
postsRouter.put("/update",authCtr.authenticateUser,authCtr.authenticateAdminStrict, postCtr.updatePost);
postsRouter.post("/newComment",authCtr.authenticateUserLoose,postCtr.createNewComment);
postsRouter.get("/:postId", postCtr.getSinglePost);

export default postsRouter;