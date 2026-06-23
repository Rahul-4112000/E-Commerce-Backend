import { ApiError } from '../utils/apiError';
import { User } from '../Models/users.models';
import { createUser, logoutUser } from '../Repository/user.repository';
import { validateInvite } from '../utils/inviteValidation';
import { COOKIE_OPTION } from '../shared/constant';

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

const registerAdmin = async (req, res) => {
  const { password, confirmPassword, inviteToken } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "password doesn't match");
  }

  const admin = await validateInvite(inviteToken);

  admin.isUsed = true;

  await admin.save({
    validateBeforeSave: false,
  });

  const user = await createUser({ email: admin.email || '', password, role: 'admin', isActive: true });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res
    .status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTION)
    .cookie('refershToken', refreshToken, COOKIE_OPTION)
    .json({ success: true, message: 'User Register sucessfully', user });
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

// const registerUser = async (req: Request, res: Response) => {
//   const { email, password, confirmPassword } = req.body as registerUser;

//   if (password !== confirmPassword) {
//     throw new ApiError(400, "Password does't match");
//   }

//   const user = await User.create({
//     email,
//     password,
//   });

//   const accessToken = user.generateAccessToken();
//   const refreshToken = user.generateRefreshToken();

//   const option = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, option)
//     .cookie("refershToken", refreshToken, option)
//     .json({ success: true, message: "User Register sucessfully", user });
// };

export { loginUser, registerAdmin, logout };
