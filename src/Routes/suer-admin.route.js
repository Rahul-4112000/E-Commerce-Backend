import { Router } from 'express';
import { authentication } from '../middleware/authentication';
import { authorizationSuperAdmin } from '../middleware/authorization';
import { invitationSchema } from '../validation/super-admin.validation';
import { validate } from '../middleware/validateReqField';
import { changeAdminStatus, getAdmins, inviteAdmin, validateInviteToken } from '../Controllers/super-admin.controller';

const superAdminRouter = Router();

superAdminRouter.route('/admin').get(authentication, authorizationSuperAdmin, getAdmins);

superAdminRouter.route('/admin/status').post(authentication, authorizationSuperAdmin, changeAdminStatus)

superAdminRouter
  .route('/invite')
  .post(validate(invitationSchema), authentication, authorizationSuperAdmin, inviteAdmin);

superAdminRouter.route('/validate-invite').post(validateInviteToken);

export default superAdminRouter;
