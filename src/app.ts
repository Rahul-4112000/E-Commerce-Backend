import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.route";
import dotenv from "dotenv";
import superAdminRouter from "./Routes/suer-admin.route";
import adminRouter from "./Routes/admin.route";
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/super-admin", superAdminRouter);
app.use("/api/v1/admin", adminRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message;

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

export default app;
