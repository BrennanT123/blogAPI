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
import cors from "cors"; // used for api calls from a different orign



import { PrismaClient, Prisma } from "./prisma/generated/prisma/index.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";



dotenv.config();

const app = express();

//CRITICAL NEEDED FOR RAILWAY
app.set('trust proxy', 1);


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
}

app.use(cors(corsOptions));



//Railway db setup
import { execSync } from "child_process";

try {
  if (process.env.NODE_ENV === "production") {
    console.log("Running Prisma migration at runtime...");

    if (
      process.env.RAILWAY_STATIC_URL ||
      process.env.NODE_ENV === "production"
    ) {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    }
  }
} catch (e) {
  console.error("Prisma migration failed:", e);
}




//setting up cors





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


// Set EJS as the view engine - You do not use this in this app 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Serve static assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));




// Start the session
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));






