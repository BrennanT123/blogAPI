import { body, query, validationResult } from "express-validator";
import { validateNewUser } from "../lib/validation.js";
import { PrismaClient } from "../prisma/generated/prisma/index.js";
import bcrypt from "bcryptjs";
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
console.log("New user created:", newUser);

      res.status(201).json({ message: "User created successfully." });
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        return res.status(400).json({
          errors: [{ msg: "Email is already registered." }],
        });
      }

      console.error(err);
      next(new CustomErr(400, "Something went wrong during registration"));
    }
  },
];