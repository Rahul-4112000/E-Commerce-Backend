import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../Models/users.models";
import  Jwt  from "jsonwebtoken";


interface DecodedToken extends JwtPayload {
  _id: string;
  name: string;
  email: string;
}


export const authentication = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(400).json({
        message: "Token is required",
        status: 400,
        success: false,
      });
    }

    const decodeToken = Jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as DecodedToken;

    if (!decodeToken) {
      return res.status(401).json({
        message: "Invalid Token",
        status: 401,
        success: false,
      });
    }

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        status: 404,
        success: false,
      });
    }

    req.user = user;


    return next()
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};