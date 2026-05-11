import mongoose from 'mongoose';
import { DATABASE_NAME } from '../shared/constant';

export const connectToDB = async () => {
 try {
    await mongoose.connect(`${process.env.DATABASE_URL}/${DATABASE_NAME}`);
    console.log("Connected to DB successfully!");
 } catch(error) {
    console.log(error);
 }
}