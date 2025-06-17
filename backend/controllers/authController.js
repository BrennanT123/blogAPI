import { body, query, validationResult } from "express-validator";
import passport from "passport";

import { validateNewUser } from "../lib/validation.js";
import { PrismaClient } from "../prisma/generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomErr from "../lib/customerrors.js";

const prisma = new PrismaClient();

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ message: "Invalid email or password" }] });
    }
    const checkPassMatch = await bcrypt.compare(password, user.hash);
    if (!checkPassMatch) {
      return res
        .status(401)
        .json({ errors: [{ message: "Invalid email or password" }] });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "login succesful",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: [{ message: "There was an error logging in" }],
    });
  }
};

//Will be used to authenticate user for protected routes (creating posts, etc..)
export const authenticateUser = (req, res, next) => {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //Get token from array
    const bearerToken = bearer[1];
    try {
      const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = decodedToken;
      //return res.status(200).json({ message: 'Authentication succesful.', user: req.user });
      next();
    } catch (err) {
      return res
        .status(403)
        .json({ errors: [{ message: "Invalid or expired token" }] });
    }
  } else {
    res.sendStatus(403);
  }
};

//used to authenticate for comments. Allows guest comments by not returning an error if it fails.
export const authenticateUserLoose = (req, res, next) => {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //Get token from array
    const bearerToken = bearer[1];
    try {
      const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = decodedToken;
      //return res.status(200).json({ message: 'Authentication succesful.', user: req.user });
      next();
    } catch (err) {}
  } else {
    next();
  }
};

export const authenticateAdmin = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ errors: [{ message: "User not authenticated" }] });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, membershipStatus: true },
    });
    if (!user) {
      return res.status(404).json({ errors: [{ message: "User not found" }] });
    }
    return res.status(200).json({
      isAdmin: user.membershipStatus === true,
    });

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ message: "Internal server error" }] });
  }
};



export const authenticateAdminStrict = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ errors: [{ message: "User not authenticated" }] });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, membershipStatus: true },
    });
    if (!user) {
      return res.status(404).json({ errors: [{ message: "User not found" }] });
    }
     req.isAdmin = user.membershipStatus === true;
       return next();

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errors: [{ message: "Internal server error" }] });
  }
};
//Not used since you plan on storing it in local storage. If you stored it using cookies then youd need something here.
// export const logoutUsr = async (req, res) => {

// };
