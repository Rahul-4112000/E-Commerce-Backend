import { Router } from "express";
import { loginUser, logout, register } from "../Controllers/auth.controller";
import { validate } from "../middleware/validateReqField";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { authentication } from "../middleware/authentication";

const authRouter = Router();

authRouter.route("/login").post(validate(loginSchema), loginUser);

authRouter.route('/register').post(validate(registerSchema), register);

authRouter.route("/logout").post(authentication, logout);
export default authRouter;
