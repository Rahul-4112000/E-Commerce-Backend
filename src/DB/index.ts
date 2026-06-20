import mongoose from 'mongoose';
import { DATABASE_NAME } from '../shared/constant';

export const connectToDB = async () => {
 try {
    const mongoDBURI = `${process.env.DATABASE_URL}/${DATABASE_NAME}`;
    await mongoose.connect(mongoDBURI);

    console.log("Connected to DB successfully!");
   } catch(error) {
    console.log(error);
 }
}