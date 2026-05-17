import mongoose, { Document, Schema } from "mongoose";

export interface IInvite extends Document {
  email: string;
  inviteToken: string;
  invitedBy?: string;
  isUsed: boolean;
  role: string;
  expiresAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    inviteToken: {
      type: String,
      require: true,
    },
    invitedBy: {
      type: String,
    },
    isUsed: {
      type: Boolean,
    },
    role: {
      type: String,
      default: "admin",
    },
    expiresAt: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true },
);

export const invite = mongoose.model<IInvite>("invite", inviteSchema);
