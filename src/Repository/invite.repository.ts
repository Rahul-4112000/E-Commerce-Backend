import { invite } from "../Models/invite.models";

export const findAdminByToken = async (inviteToken: string) => {
  return await invite.findOne({
    inviteToken,
  });
};

export const createAdmin = async (
  email: string,
  inviteToken: string,
  expiresAt: Date,
) => {
  return await invite.create({
    email,
    inviteToken,
    expiresAt,
  });
};


