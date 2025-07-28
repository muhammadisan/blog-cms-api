`src/app.ts`

import express, { Application } from 'express';
import morgan from 'morgan'; // Logs HTTP requests to the console
import cors from 'cors'; // Enables Cross-Origin Resource Sharing
import helmet from 'helmet'; // Secures HTTP headers
import cookieParser from 'cookie-parser'; // Parses cookies from requests

import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import articleRoutes from './routes/articleRoutes';
import userRoutes from './routes/userRoutes';
import pageViewRoutes from './routes/pageViewRoutes';

const app: Application = express();

// Global middlewares
app.use(helmet()); // Apply security best practices
app.use(cors()); // Allow cross-origin requests
app.use(morgan('dev')); // Log incoming requests
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/page-views', pageViewRoutes);

// Healthcheck route (for Docker/monitoring)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Handle unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
