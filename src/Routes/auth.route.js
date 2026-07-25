import { Router } from "express";
import { getUserProfile, loginUser, logout } from "../Controllers/auth.controller";
import { validate } from "../middleware/validateReqField";
import { loginSchema } from "../validation/auth.validation";
import { authentication } from "../middleware/authentication";

const authRouter = Router();

authRouter.route("/login").post(validate(loginSchema), loginUser);

authRouter.route("/logout").post(authentication, logout);

authRouter.route('/profile').get(authentication, getUserProfile)

export default authRouter;
