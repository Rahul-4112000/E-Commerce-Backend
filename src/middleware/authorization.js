import { ROLE_TYPE } from '../shared/types';

export const authorizationSuperAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== ROLE_TYPE.SUPER_ADMIN) {
    return res.status(403).json({
      message: 'Unauthorized',
      status: 403,
      success: false,
    });
  }

  return next();
};
