import mongoose, { Schema } from "mongoose";

const inviteSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    inviteToken: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const invite = mongoose.model("invite", inviteSchema);
