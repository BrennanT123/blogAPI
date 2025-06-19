import { body, query, validationResult } from "express-validator";
import { validateNewUser } from "../lib/validation.js";
import { PrismaClient } from "../prisma/generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomErr from "../lib/customerrors.js";

const prisma = new PrismaClient();
export const createUser = [
  validateNewUser,
  async (req, res, next) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      return res.status(400).json({
        errors: validateErrors.array(),
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          email: req.body.user_email,
          hash: hash,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
        },
      });

      res.status(201).json({ msg: "User created successfully." });
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        return res.status(400).json({
          errors: [{ msg: "Email is already registered." }],
        });
      }

              return next(res.status(400).json({ errors: [{ msg: "Something went wrong" }] }));

    }
  },
];


//Route for getting the user data 

export const postUserData = async (req, res, next) => {
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.body.id),
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }
    return res.status(200).json(user);
  } catch {
    return res
      .status(500)
      .json({ errors: [{ msg: "Internal server error" }] });
  }
};




export const getLoggedInUserName = async (req, res) => {
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
    
        //return res.status(200).json({ msg: 'Authentication succesful.', user: req.user });
        return res.status(200).json({
          name: req.user.firstName + " " + req.user.lastName 
        });
      } catch (err) {
        
      }
    } else {
      return false;
    }
  };