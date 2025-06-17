import { body, query, validationResult } from "express-validator";
import passport from "passport";

import { validateNewPost, validateNewComment } from "../lib/validation.js";
import { PrismaClient } from "../prisma/generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomErr from "../lib/customerrors.js";

const prisma = new PrismaClient();

//returns the posts, the author for the post, and all the comments associated with it
export const getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        comments: true,
      },
    });
    if (posts.length === 0) {
      return res.status(404).json({ errors: [{ message: "No posts found" }] });
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    if (err.code === "P2025") {
      //prisma error for "record not found"
      return res.status(404).json({ errors: [{ message: "No posts found" }] });
    }

    return res
      .status(500)
      .json({
        errors: [{ message: "Failed to get posts for unknown reason" }],
      });
  }
};

//creates a new post
export const createPost = [
  validateNewPost,
  async (req, res, next) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      return res.status(400).json({
        errors: validateErrors.array(),
      });
    }

    if (!req.user?.id) {
      return res
        .status(401)
        .json({ errors: [{ message: "User not authenticated" }] });
    }
    if (!req.isAdmin) {
      return res.status(403).json({ errors: [{ message: "Access denied" }] });
    }

    try {
      const newPost = await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          authorId: req.user.id,
        },
      });

      return res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (err) {
      console.error(err);
      if (err.code === "P2025") {
        //prisma error for "record not found"

        return res
          .status(404)
          .json({ errors: [{ message: "No posts found" }] });
      }

      next(
        res.status(500).json({
          errors: [{ message: "Failed to create post for unknown reasons" }],
        })
      );
    }
  },
];

export const deletePost = async (req, res, next) => {
  const postId = req.body.postId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid or missing postId." });
  }
  const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
  if (!post) {
    return res.status(404).json({ errors: [{ message: "No post found" }] });
  }
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ errors: [{ message: "Unauthorized" }] });
  }
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
      deletedPost,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "P2025") {
      //prisma error for "record not found"

      return res.status(404).json({ errors: [{ message: "No posts found" }] });
    }

    return res.status(500).json({
      error: "Something went wrong while deleting the post.",
    });
  }
};

export const updatePost = [
  validateNewPost,
  async (req, res, next) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      return res.status(400).json({ errors: validateErrors.array() });
    }

    const postId = Number(req.body.postId);
    if (!postId || isNaN(postId)) {
      return next(
        res
          .status(400)
          .json({ errors: [{ message: "Invalid or missing postID" }] })
      );
    }

    try {
      const doesPostExist = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!doesPostExist) {
        return next(
          res.status(404).json({ errors: [{ message: "No posts found" }] })
        );
      }

      if (doesPostExist.authorId !== req.user.id) {
        return next(
          res
            .status(403)
            .json({
              errors: [{ message: "User is not authorized to edit post" }],
            })
        );
      }

      const newPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title: req.body.title,
          content: req.body.content,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        message: "Post updated successfully",
        post: newPost,
      });
    } catch (err) {
      if (err.code === "P2025") {
        //prisma error for "record not found"
        return next(
          res.status(404).json({ errors: [{ message: "No posts found" }] })
        );
      }

      console.error(err);
      return next(
        res.status(500).json({ errors: [{ message: "Server error" }] })
      );
    }
  },
];
export const createNewComment = [
  validateNewComment,
  async (req, res, next) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      return res.status(400).json({ errors: validateErrors.array() });
    }

    const postId = Number(req.body.post);
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid or missing post ID" });
    }

    const content = req.body.content;

    try {
      let newComment;

      if (!req.user?.id) {
        //Guest user
        const guestName = req.body.author;
        if (!guestName) {
          return res
            .status(400)
            .json({ error: "Guest author name is required" });
        }

        newComment = await prisma.comment.create({
          data: {
            content,
            postId,
            guestName,
          },
        });
      } else {
        //Authenticated user
        newComment = await prisma.comment.create({
          data: {
            content,
            postId,
            authorId: req.user.id,
          },
        });
      }

      res.status(201).json({
        message: "Comment created successfully",
        comment: newComment,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: [{ message: "Server error" }] });
    }
  },
];
