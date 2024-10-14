// models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
