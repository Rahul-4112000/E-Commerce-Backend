import mongoose, { Schema, Document } from "mongoose";
import { compare } from "bcrypt-ts";
import Jwt from "jsonwebtoken";
import { hash } from "bcrypt-ts";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  lastLogin: Date;
  refreshToken: string;
  role: "admin" | "super_admin" | "user";
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "super_admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  this.password = await hash(this.password, 10);
});

userSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACESS_TOKEN_EXPIRES_IN as any },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any },
  );
};

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string,
) {
  return await compare(password, this.password);
};

export const User = mongoose.model<IUser>("users", userSchema);
