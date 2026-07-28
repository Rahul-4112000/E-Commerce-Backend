import { User } from '../Models/users.models';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { mapAuthUserToClient } from '../mapper/auth.mapper';

const getMe = (req, res) => {
  // req.user is already mapped by authentication middleware
  return res.status(200).json(new ApiResponse('User profile fetched successfully', { user: req.user }));
};

const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const userId = req.user.id;

  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name;
  if (phone !== undefined) updatePayload.phone = phone;
  if (avatar !== undefined) updatePayload.avatar = avatar;

  const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse('Profile updated successfully', { user: mapAuthUserToClient(updatedUser) }));
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isCurrentPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isCurrentPasswordCorrect) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse('Password changed successfully'));
};

export { getMe, updateProfile, changePassword };
