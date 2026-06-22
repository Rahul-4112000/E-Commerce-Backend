import { invite } from "../Models/invite.models";

export const findAdminByToken = async (inviteToken) => {
  return await invite.findOne({
    inviteToken,
  });
};

export const createAdmin = async (
  email,
  inviteToken,
  expiresAt,
) => {
  return await invite.create({
    email,
    inviteToken,
    expiresAt,
  });
};


