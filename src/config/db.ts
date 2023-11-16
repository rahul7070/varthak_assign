import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const connection = async () => {
  try {
    await mongoose.connect(process.env.mongoDB || "");
    console.log('Connected to Database');
  } catch (error) {
    console.error('Error:', error);
  }
};