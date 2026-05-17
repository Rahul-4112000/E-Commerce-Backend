import { Router } from "express";
import { loginUser } from "../Controllers/user.controller";
import { validate } from "../middleware/validateReqField";
import { loginSchema, registerSchema } from "../validation/auth.validation";

const userRouter = Router();

userRouter.route("/login").post(validate(loginSchema), loginUser);

export default userRouter;
