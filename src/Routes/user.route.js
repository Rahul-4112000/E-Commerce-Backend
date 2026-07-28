import { Router } from 'express';
import { authentication } from '../middleware/authentication';
import { validate } from '../middleware/validateReqField';
import { updateProfileSchema, changePasswordSchema } from '../validation/user.validation';
import { getMe, updateProfile, changePassword } from '../Controllers/user.controller';

const userRouter = Router();

userRouter.route('/me').get(authentication, getMe);

userRouter.route('/me').patch(authentication, validate(updateProfileSchema), updateProfile);

userRouter.route('/change-password').patch(authentication, validate(changePasswordSchema), changePassword);

export default userRouter;
