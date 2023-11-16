import mongoose, { Document, Schema } from 'mongoose';

export interface BookDocument extends Document {
  title: string;
  author: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Assuming a reference to a User model
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model<BookDocument>('Book', bookSchema);

export default Book;
