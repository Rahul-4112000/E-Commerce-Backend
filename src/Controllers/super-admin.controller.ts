import { Request, Response } from "express";
import crypto from "crypto";
import { sendMail } from "../shared/services/mail.service";
import { validateInvite } from "../utils/inviteValidation";
import { createAdmin } from "../Repository/invite.repository";

type inviteRequest = {
  inviteToken: string;
};

const inviteAdmin = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  try {
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const today = new Date();
    const tommorrowTimeStamp = today.setDate(today.getDate() + 1);
    const expiryTommorrow = new Date(tommorrowTimeStamp);

    await createAdmin(email, inviteToken, expiryTommorrow);

    await sendMail(email, inviteToken);

    return res.status(201).json({
        status: 201,
      success: true, 
      message: "invited successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
    });
  }
};

const validateInviteToken = async (req: Request, res: Response) => {
  const { inviteToken } = req.body as inviteRequest;

  const admin = await validateInvite(inviteToken);

  return res.status(200).json({
    success: true,
    message: 'token is valid',
    user: admin
  })
};

export { inviteAdmin, validateInviteToken };
