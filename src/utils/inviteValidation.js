import { findAdminByToken } from "../Repository/invite.repository";
import { ApiError } from "./apiError";

export const validateInvite = async (inviteToken) => {
  if (!inviteToken) {
    throw new ApiError(400, "token is required");
  }

  const admin = await findAdminByToken(inviteToken);

  if (!admin) {
    throw new ApiError(404, "invite is invalid");
  }

  const isExpired = admin.expiresAt <= new Date();

  if (isExpired) {
    throw new ApiError(401, "invite is expired");
  }

  return admin;
};
