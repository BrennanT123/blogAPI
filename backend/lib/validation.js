import { body, query, validationResult } from "express-validator";
import { PrismaClient } from "../prisma/generated/prisma/index.js";

const prisma = new PrismaClient();

const alphaErr = "must only contain letters.";
const nameLengthErr = "must be be between 1 and 10 characters.";

export const validateNewUser = [
  body("user_email")
    .notEmpty()
    .withMessage("Please fill out email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (email, { req }) => {
      const checkAvailable = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (checkAvailable) {
        throw new Error("Account with email already exists.");
      }
      return true;
    }),

  body("first_name")
    .notEmpty()
    .withMessage("Please fill out first name")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${nameLengthErr}`),

  body("last_name")
    .notEmpty()
    .withMessage("Please fill out last name")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${nameLengthErr}`),

  body("password")
    .notEmpty()
    .withMessage("Please fill out password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters and include at least one uppercase, lowercase, number, and special character."
    )
    .isLength({ max: 64 })
    .withMessage("Password must be less than 64 characters long"),

  body("confirm_password")
    .notEmpty()
    .withMessage("Please fill out confirm password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const titleErr =
  "Title must only contain letters, numbers, and common punctuation.";
const contentErr = "Content must be between 1 and 5000 characters.";
const titleLengthErr = "Title must be between 1 and 100 characters.";

export const validateNewPost = [
  body("title")
    .notEmpty()
    .withMessage("Please fill out the title")
    .trim()
    .matches(/^[a-zA-Z0-9 .,'"!?:;()-]+$/)
    .withMessage(titleErr)
    .isLength({ min: 1, max: 100 })
    .withMessage(titleLengthErr),

  body("content")
    .notEmpty()
    .withMessage("Please fill out the content")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage(contentErr),
];

const commentLengthErr = "must be between 1 and 500 characters.";
const alphanumErr =
  "must only contain letters, numbers, spaces, and basic punctuation.";

export const validateNewComment = [
  body("content")
    .notEmpty()
    .withMessage("Please fill out comment content")
    .trim()
    .matches(/^[\w\s.,!?'"()-]+$/)
    .withMessage(`Comment ${alphanumErr}`)
    .isLength({ min: 1, max: 500 })
    .withMessage(`Comment ${commentLengthErr}`),
  body("guestAuthor").custom((value, { req }) => {
    if (!req.user) {
      if (!value || value.trim() === "") {
        throw new Error("Author name is required for guest comments");
      }
    }
    return true;
  }),

  body("post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isInt({ gt: 0 })
    .withMessage("Post ID must be a positive integer"),
];
