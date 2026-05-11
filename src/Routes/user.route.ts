import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/user.controller";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validation/auth.validation";

const userRouter = Router();


userRouter.route('/login').post(validate(loginSchema) ,loginUser)

userRouter.route('/register').post(validate(registerSchema),registerUser)


export default userRouter
