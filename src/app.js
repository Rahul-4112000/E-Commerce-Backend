import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRouter from "./Routes/admin.route";
import authRouter from "./Routes/auth.route";
import userRouter from "./Routes/user.route";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestLogger)

app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

export default app;
