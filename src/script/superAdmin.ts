import mongoose from "mongoose";
import { User } from "../Models/users.models";
import "dotenv/config";
import { DATABASE_NAME } from "../shared/constant";
import { connectToDB } from "../DB";

connectToDB().then(async () => {

  await User.create({
    name: "Rahul",
    email: "rahul69@gmail.com",
    password: "rahul@121",
    role: "super_admin",
  });

  console.log('Super Admin created successfully')

}).catch((err) => {
    console.log('ERROR: ======>',err.errors)
});
