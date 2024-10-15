# Bookstore API

This is a simple Bookstore API built with **Node.js** and **Express.js**, using **MongoDB** as the database. It includes JWT-based authentication, book management (CRUD operations), rate-limiting middleware, and API documentation via Swagger.

## Project Structure

├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── bookController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   ├── models
│   │   ├── userModel.js
│   │   └── bookModel.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── bookRoutes.js
│   ├── docs
│   │   └── swagger.json
│   ├── server.js
├── package.json
└── README.md


## Prerequisites

Make sure you have the following installed:
- Node.js (v14+)
- MongoDB (Local or cloud instance like MongoDB Atlas)
- A Render or Vercel account for deployment

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/bookstore-api.git
cd bookstore-api

## Install dependencies

npm install

## Accessing the API
# Once the server is running, you can access the following endpoints:

Swagger UI Documentation: http://localhost:3010/api-docs
Health Check: http://localhost:3010/
API Endpoints
Auth Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login an existing user
Books Endpoints
Method	Endpoint	Description
GET	/api/books	Get all books
POST	/api/books	Create a new book (Auth)
GET	/api/books/:id	Get a single book by ID
PUT	/api/books/:id	Update a book by ID (Auth)
DELETE	/api/books/:id	Delete a book by ID (Auth)

## Scripts
npm run start: Start the server (production mode).
npm run dev: Start the server with nodemon (development mode).
npm run build: Build command (No build step required here).
npm run test: Run tests using Jest.