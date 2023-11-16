// src/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  password: string;
  roles: string[];
}

const userSchema: Schema = new Schema({
  username: { type: String, unique: true },
  password: String,
  roles: [String],
});

export default mongoose.model<UserDocument>('User', userSchema);
