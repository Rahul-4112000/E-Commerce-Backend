import crypto from 'crypto';
import { sendMail } from '../shared/services/mail.service';
import { validateInvite } from '../utils/inviteValidation';
import { createInvite } from '../Repository/invite.repository';
import { User } from '../Models/users.models';
import { ApiError } from '../utils/apiError';
import { ROLE_TYPE } from '../shared/types';
import { ApiResponse } from '../utils/apiResponse';
import { adminInviteMapper, mapAdminListToClient } from '../mapper/admin.mapper';
import { buildPaginationMetaData } from '../utils/util';
import { COOKIE_OPTION, INVITE_STATUS } from '../shared/constant';
import { invite } from '../Models/invite.models';
import { mapAuthUserToClient } from '../mapper/auth.mapper';

const inviteAdmin = async (req, res) => {
  const inviteToken = crypto.randomBytes(32).toString('hex');
  console.log(inviteToken, 'token')
  const now = new Date();
  const tomorrow = new Date();
  const ONE_DAY = 1;
  const tomorrowTimeStamp = tomorrow.setDate(tomorrow.getDate() + ONE_DAY);
  const expiryTomorrow = new Date(tomorrowTimeStamp);

  const { email } = req.body;

  const invitation = await invite.findOne({ email: email });

  if (invitation) {
    if (invitation.status === INVITE_STATUS.ACCEPTED) {
      throw new ApiError(409, "Invitation has already been accepted");
    }

    if (invitation.status === INVITE_STATUS.SENT && invitation.expiresAt >= now) {
      throw new ApiError(409, "A valid invitation has already been sent");
    }

    if (invitation.status === INVITE_STATUS.SENT && invitation.expiresAt <= now) {
      const expiredTimestamp = new Date();
      invitation.expiresAt = expiredTimestamp.setDate(expiredTimestamp.getDate() + ONE_DAY);
      invitation.save({ validateBeforeSave: false });
      await sendMail(email, inviteToken)
      return res.status(200).json(new ApiResponse('Invitation resent successfully'))
    }

    if (invitation.status === INVITE_STATUS.FAILED) {
      const expiredTimestamp = new Date();
      invitation.expiresAt = expiredTimestamp.setDate(expiredTimestamp.getDate() + ONE_DAY);
      invitation.status = INVITE_STATUS.SENT
      invitation.save({ validateBeforeSave: false });
      await sendMail(email, inviteToken)
      return res.status(200).json(new ApiResponse('Invitation resent successfully'))
    }
  }

  let invitationModel;
  try {
    invitationModel = await createInvite(email, inviteToken, expiryTomorrow);
    await sendMail(email, inviteToken);
    invitationModel.status = INVITE_STATUS.SENT;
    invitationModel.save({ validateBeforeSave: false });
    return res.status(201).json(new ApiResponse('Invitation sent successfully'))
  } catch (error) {
    invitationModel.status = INVITE_STATUS.FAILED;
    invitationModel.save({ validateBeforeSave: false });
    throw error;
  }
};

const validateInvitation = async (req, res) => {
  const { token } = req.params;

  const invitation = await validateInvite(token);

  return res.status(200).json(new ApiResponse('Invitation is valid', { invitation: adminInviteMapper(invitation) }));
};

const acceptAdminInvitation = async (req, res) => {
  const { password, confirmPassword, inviteToken, name = '' } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "password doesn't match");
  }

  const invitation = await validateInvite(inviteToken);

  invitation.status = INVITE_STATUS.ACCEPTED;

  await invitation.save({
    validateBeforeSave: false,
  });

  const user = await User.create({ name: name, email: invitation.email, password, role: ROLE_TYPE.ADMIN, isActive: true });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res
    .status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTION)
    .cookie('refreshToken', refreshToken, COOKIE_OPTION)
    .json(new ApiResponse('Admin registered successfully!', { user: mapAuthUserToClient(user) }));
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
      buildPaginationMetaData({ page: parsedPage, limit: parsedLimit, itemCount })
    ),
  );
};

const updateAdmin = async (req, res) => {
  const adminId = req.params.adminId;
  const isActive = req.body.isActive;

  if (typeof isActive !== 'boolean') {
    throw new ApiError(401, 'status should be boolean only');
  }

  const user = await User.findByIdAndUpdate(adminId, { isActive });

  if (!user) {
    throw new ApiError(404, 'User not found!!');
  }
  return res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
    data: {
      id: user._id,
      isActive: user.isActive,
    },
  });
};

export { inviteAdmin, validateInvitation, acceptAdminInvitation, getAdmins, updateAdmin };
