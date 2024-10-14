// controllers/bookController.js
import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';
import Joi from 'joi';

// Validation schema using Joi
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

// @desc    Get all books with search and pagination
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, title, author, genre } = req.query;

  // Build query object
  let query = {};
  if (title) query.title = { $regex: title, $options: 'i' };
  if (author) query.author = { $regex: author, $options: 'i' };
  if (genre) query.genre = { $regex: genre, $options: 'i' };

  const books = await Book.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Book.countDocuments(query);

  res.json({
    books,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  // Validate input
  const { error } = bookSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { title, author, genre, description, price } = req.body;

  const book = new Book({
    title,
    author,
    genre,
    description,
    price,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, genre, description, price } = req.body;

  const book = await Book.findByIdAndUpdate(req.params.id);
  
  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.price = price || book.price;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (book) {
    // Instead of book.remove(), you can delete directly with findByIdAndDelete
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});


export { getBooks, getBook, createBook, updateBook, deleteBook };
