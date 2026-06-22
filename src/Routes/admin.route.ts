import { Router } from 'express';
import { validate } from '../middleware/validateReqField';
import { adminRegisterSchema, registerSchema } from '../validation/auth.validation';
import { registerAdmin } from '../Controllers/user.controller';
import { authentication } from '../middleware/authentication';
import { authorizationSuperAdmin } from '../middleware/authorization';

const adminRouter = Router();

adminRouter.route('/register').post(validate(adminRegisterSchema), registerAdmin);

export default adminRouter;
