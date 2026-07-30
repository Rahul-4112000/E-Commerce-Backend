import { User } from '../Models/users.models';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { mapAuthUserToClient } from '../mapper/auth.mapper';
import { handleUpload } from '../shared/services/upload.service';
import { AVATAR_UPLOAD_CONFIG } from '../shared/constant';

const getMe = (req, res) => {
  return res.status(200).json(new ApiResponse('User profile fetched successfully', { user: req.user }));
};

const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const file = req.file;
  const userId = req.user.id;

  const updatePayload = {};
  if (name !== undefined) updatePayload.name = name;
  if (phone !== undefined) updatePayload.phone = phone;

  if (file) {
    if (file.size > AVATAR_UPLOAD_CONFIG.maxSize) {
      throw new ApiError(401, 'Image must be smaller than 2MB');
    }

    if (!file.mimetype.includes(AVATAR_UPLOAD_CONFIG.allowedTypes)) {
      throw new ApiError(401, `only ${AVATAR_UPLOAD_CONFIG.allowedTypes.join(', ')}`)
    }

    const image = await handleUpload(file.buffer);
    updatePayload.avatar = image.secure_url
    updatePayload.avatarPublicId = image.public_id
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, 'No changes provided')
  }

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
