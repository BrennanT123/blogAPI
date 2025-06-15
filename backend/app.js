import express from "express";
import session from "express-session";
import passport from "passport";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoutes.js";
import postsRouter from "./routes/postsRouter.js";
import usersRouter from "./routes/usersRouter.js";

import { PrismaClient, Prisma } from "./prisma/generated/prisma/index.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";



dotenv.config();

const app = express();

// JSON parsing middleware
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Serve static assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));




// Start the session
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));






