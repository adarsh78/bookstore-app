// routes/bookRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;
