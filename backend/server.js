// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./docs/swagger.json" assert { type: "json" }

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(apiLimiter); // Apply rate limiting to all requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// API Documentation
// server.js
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors({
  origin: 'http://localhost:3010', // Corrected the origin to the base URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Error Handling Middleware
app.use(errorHandler);

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// Start Server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});