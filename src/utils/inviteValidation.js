import { findInvitation } from "../Repository/invite.repository";
import { INVITE_STATUS } from "../shared/constant";
import { ApiError } from "./apiError";

export const validateInvite = async (inviteToken) => {
  if (!inviteToken) {
    throw new ApiError(400, "token is required");
  }

  const invitation = await findInvitation(inviteToken);

  if (!invitation) {
    throw new ApiError(404, "Invalid invitation");
  }

  const now = new Date();

  const isExpired = invitation.expiresAt <= now;

  if (invitation.status === INVITE_STATUS.ACCEPTED || invitation.status === INVITE_STATUS.FAILED || (invitation.status === INVITE_STATUS.SENT && isExpired)) {
    throw new ApiError(410, "Invitation is no longer valid");
  }

  return invitation;
};
