import { ApiError } from '../utils/apiError';
import { User } from '../Models/users.models';
import { logoutUser } from '../Repository/user.repository';
import { COOKIE_OPTION } from '../shared/constant';
import { mapAuthUserToClient } from '../mapper/auth.mapper';
import { ApiResponse } from '../utils/apiResponse';

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Password is incorrect',
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.lastLogin = new Date();
  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  const { password: _, refreshToken: __, ...userWithoutSensitiveField } = user.toObject();
  return res
    .status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTION)
    .cookie('refreshToken', refreshToken, COOKIE_OPTION)
    .json({
      success: true,
      message: 'User Login Successfully',
      statusCode: 200,
      user: userWithoutSensitiveField,
    });
};

const logout = async (req, res) => {
  const userId = req.user._id;

  const existingUser = await User.findById(userId).select('refreshToken');

  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const isAlreadyLoggedOut = !existingUser.refreshToken;

  if (isAlreadyLoggedOut) {
    return res.status(400).json({
      success: false,
      message: 'User is already logged out',
    });
  }

  const user = await logoutUser(userId);

  if (!user) {
    throw new ApiError(500, 'something went wrong');
  }

  res.clearCookie('accessToken', COOKIE_OPTION);
  res.clearCookie('refreshToken', COOKIE_OPTION);

  return res.status(200).json({
    success: true,
    message: 'User Logout Successfully',
  });
}

const getUserProfile = (req, res) => {
  const user = mapAuthUserToClient(req.user);

  return res.status(200).json(new ApiResponse('fetched user profile successfully', { user }))
}

export { loginUser, logout, getUserProfile };
