import { NextFunction, Request, Response } from "express";
import { EROLE_TYPE } from "../shared/types";

export const authorizationSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user || user.role !== EROLE_TYPE.SUPER_ADMIN) {
    return res.status(403).json({
      message: "Unauthorized",
      status: 403,
      success: false,
    });
  }

  console.log('authorization passed')

  return next();
};
