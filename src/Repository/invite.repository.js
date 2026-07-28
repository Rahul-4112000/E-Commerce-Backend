import { invite } from "../Models/invite.models";

export const findInvitation = async (inviteToken) => {
  return await invite.findOne({
    inviteToken,
  });
};

export const createInvite = async (
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


