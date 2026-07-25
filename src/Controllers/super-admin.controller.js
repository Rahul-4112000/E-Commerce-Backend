import crypto from 'crypto';
import { sendMail } from '../shared/services/mail.service';
import { validateInvite } from '../utils/inviteValidation';
import { createAdmin } from '../Repository/invite.repository';
import { User } from '../Models/users.models';
import { ApiError } from '../utils/apiError';
import { ROLE_TYPE } from '../shared/types';
import { ApiResponse } from '../utils/apiResponse';
import { mapAdminListToClient } from '../mapper/admin.mapper';
import { buildPaginationMetaData } from '../utils/util';

const inviteAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const today = new Date();
    const tommorrowTimeStamp = today.setDate(today.getDate() + 1);
    const expiryTommorrow = new Date(tommorrowTimeStamp);

    await createAdmin(email, inviteToken, expiryTommorrow);

    await sendMail(email, inviteToken);

    return res.status(201).json({
      status: 201,
      success: true,
      message: 'invited successfully',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'something went wrong',
    });
  }
};

const validateInviteToken = async (req, res) => {
  const { inviteToken } = req.body;

  const admin = await validateInvite(inviteToken);

  return res.status(200).json({
    success: true,
    message: 'token is valid',
    user: admin,
  });
};

const getAdmins = async (req, res) => {
  const { search, page = 1, limit = 2 } = req.query;
  const query = { role: ROLE_TYPE.ADMIN };

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const offset = (parsedPage - 1) * parsedLimit;

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [adminList, itemCount] = await Promise.all([User.find(query).skip(offset).limit(parsedLimit).lean(), User.countDocuments(query)]);

  return res.status(200).json(
    new ApiResponse(
      'Admins fetched successfully',
      mapAdminListToClient(adminList),
      buildPaginationMetaData({ page, limit, itemCount })
    ),
  );
};

const changeAdminStatus = async (req, res) => {
  const adminId = req.body.id;
  const isActive = req.body.isActive;

  if (typeof isActive !== 'boolean') {
    throw new ApiError(401, 'status should be boolean only');
  }

  const user = await User.findByIdAndUpdate(adminId, { isActive });

  if (!user) {
    throw new ApiError(404, 'User not found!!');
  }
  return res.status(201).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
    data: {
      id: user._id,
      isActive: user.isActive,
    },
  });
};

export { inviteAdmin, validateInviteToken, getAdmins, changeAdminStatus };
