import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { User } from "../Models/users.models";

type loginUser = {
  email: string;
  password: string;
};

type registerUser = loginUser & {
    confirmPassword: string
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as loginUser;

  const user = await User.findOne({ email: email }).select("password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is wrong");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refershToken", refreshToken, option)
    .json({ success: true, message: "User Login Successfully" });
};


const registerUser = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body as registerUser;

  if(password !== confirmPassword){
    throw new ApiError(400,"Password does't match");
  }

  const user = await User.create({
    email,
    password
  })

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refershToken", refreshToken, option)
    .json({ success: true, message: "User Register sucessfully" });
};

export { loginUser, registerUser };
