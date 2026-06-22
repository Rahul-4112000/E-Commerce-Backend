import { Router } from 'express';
import { validate } from '../middleware/validateReqField';
import { adminRegisterSchema, registerSchema } from '../validation/auth.validation';
import { registerAdmin } from '../Controllers/auth.controller';

const adminRouter = Router();

adminRouter.route('/register').post(validate(adminRegisterSchema), registerAdmin);

export default adminRouter;
