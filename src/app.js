import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRouter from "./Routes/admin.route";
import authRouter from "./Routes/auth.route";
import { requestLogger } from "./middleware/requestLogger.js";
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestLogger)

app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter)

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

export default app;
