import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { User } from "../Models/users.models";
import { createUser } from "../Repository/user.repository";
import { validateInvite } from "../utils/inviteValidation";

type loginUserType = {
  email: string;
  password: string;
};

type registerAdminType = {
  password: string;
  confirmPassword: string;
  inviteToken: string;
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as loginUserType;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found",
    });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      statusCode: 400,
      message: "Password is incorrect",
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.lastLogin = new Date();
  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave:false
  })

  const { password: _, refreshToken:__, ...userWithoutSenstiveField } = user.toObject();
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
    .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
    .json({ 
      success: true,  
      message: "User Login Successfully",
      statusCode: 200,
      user: userWithoutSenstiveField,
    });
};

const registerAdmin = async (req: Request, res: Response) => {
  const { password, confirmPassword, inviteToken } = req.body as registerAdminType;

  if (password !== confirmPassword) {
    throw new ApiError(400, "password doesn't match");
  }

  const admin = await validateInvite(inviteToken);

  admin.isUsed = true;

  await admin.save({
    validateBeforeSave:false
  })

  const user = await createUser({ email: admin.email || "", password, role: "admin", isActive: true });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refershToken", refreshToken, option)
    .json({ success: true, message: "User Register sucessfully", user });
};


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

export { loginUser, registerAdmin };
