import { Router } from 'express';
import { validate } from '../middleware/validateReqField';
import { adminRegisterSchema } from '../validation/auth.validation';
import { authentication } from '../middleware/authentication';
import { authorizationSuperAdmin } from '../middleware/authorization';
import { acceptAdminInvitation, getAdmins, inviteAdmin, updateAdmin, validateInvitation } from '../Controllers/admin.controller';
import { invitationSchema } from '../validation/super-admin.validation';

const adminRouter = Router();

adminRouter
  .route('/invitations')
  .post(validate(invitationSchema), authentication, authorizationSuperAdmin, inviteAdmin);

adminRouter.route('/invitations/accept').post(validate(adminRegisterSchema), acceptAdminInvitation);

adminRouter.route('/invitations/:token').get(validateInvitation);

adminRouter.route('/').get(authentication, authorizationSuperAdmin, getAdmins);

adminRouter.route('/:adminId').patch(authentication, authorizationSuperAdmin, updateAdmin)

export default adminRouter;
