import "dotenv/config";
import { faker } from "@faker-js/faker";
import { connectToDB } from "../DB";
import { User } from "../Models/users.models";

await connectToDB();

try {
  const admins = [];

  for (let i = 1; i <= 30; i++) {
    admins.push({
      name: faker.person.fullName(),
      email: `admin${i}@gmail.com`,
      password: "Admin@123",
      role: "admin",
      isActive: faker.datatype.boolean(),
    });
  }

  await User.insertMany(admins);

  console.log("30 admins created successfully");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}