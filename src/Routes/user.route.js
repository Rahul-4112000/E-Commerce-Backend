import { Router } from 'express';
import { authentication } from '../middleware/authentication';
import { getUserProfile } from '../Controllers/user.controller';

const userRouter = Router();

userRouter.route('/profile').get(authentication, getUserProfile)

export default userRouter;

