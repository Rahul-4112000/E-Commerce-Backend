import { User } from "../Models/users.models";
import "dotenv/config";
import { connectToDB } from "../DB";

connectToDB().then(async () => {

  await User.create({
    name: "rakesh",
    email: "rakesh@gmail.com",
    password: "rakesh@121",
    role: "super_admin",
  });

  console.log('Super Admin created successfully')

}).catch((err) => {
  console.log('ERROR: ======>', err.errors)
});
