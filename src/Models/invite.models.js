import mongoose, { Schema } from "mongoose";
import { INVITE_STATUS } from "../shared/constant";

const inviteSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required'],
    },
    inviteToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [INVITE_STATUS.ACCEPTED, INVITE_STATUS.FAILED, INVITE_STATUS.PENDING, INVITE_STATUS.SENT],
      default: INVITE_STATUS.PENDING
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const invite = mongoose.model("invite", inviteSchema);
