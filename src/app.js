import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import superAdminRouter from "./Routes/suer-admin.route";
import adminRouter from "./Routes/admin.route";
import authRouter from "./Routes/auth.route";
import userRouter from "./Routes/user.route";
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/super-admin", superAdminRouter);
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)

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
