import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getInviteEmailTemplet } from '../../emailTemplet/invite';
import { handleNodeMailerErrors } from '../../utils/apiError';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

export const sendMail = async (toEmail, token) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    name: 'Admin Invitation',
    subject: 'Invitation to become Admin',
    html: getInviteEmailTemplet(`${process.env.FRONTEND_URL}/invite?inviteToken=${token}`),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    const err = handleNodeMailerErrors(error);
    throw err;
  }
};
