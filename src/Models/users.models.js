import mongoose, { Schema } from 'mongoose';
import { compare } from 'bcrypt-ts';
import Jwt from 'jsonwebtoken';
import { hash } from 'bcrypt-ts';

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'super_admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hash(this.password, 10);
});

userSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACESS_TOKEN_EXPIRES_IN }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  );
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await compare(password, this.password);
};

export const User = mongoose.model('users', userSchema);
