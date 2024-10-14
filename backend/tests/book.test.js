// tests/book.test.js
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Book from '../models/Book.js';
import jwt from 'jsonwebtoken';

describe('Book API', () => {
  let token;
  let bookId;

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user and generate token
    const user = await User.create({
      name: 'Test Book User',
      email: 'bookuser@example.com',
      password: 'password123',
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  });

  afterAll(async () => {
    // Clean up database after tests
    await User.deleteMany({});
    await Book.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Book',
          author: 'Author Name',
          genre: 'Fiction',
          description: 'A great book',
          price: 19.99,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      bookId = res.body._id;
    });

    it('should not create a book without required fields', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Incomplete Book',
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/books', () => {
    it('should get all books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toEqual(200);
      expect(res.body.books.length).toBeGreaterThan(0);
    });

    it('should search books by title', async () => {
      const res = await request(app).get('/api/books').query({ title: 'Test Book' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.books[0].title).toEqual('Test Book');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should get a single book', async () => {
      const res = await request(app).get(`/api/books/${bookId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'Test Book');
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app).get(`/api/books/${mongoose.Types.ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Book not found');
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 24.99,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('price', 24.99);
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app)
        .put(`/api/books/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 24.99,
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Book not found');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Book removed');
    });

    it('should return 404 for non-existent book', async () => {
      const res = await request(app)
        .delete(`/api/books/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Book not found');
    });
  });
});
