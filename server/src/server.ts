import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import instructorRoutes from './routes/instructorRoutes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/instructors', instructorRoutes);

// Health check
// Dev Diagnostic endpoint TODO maybe delete for production? 
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'production' ? {} : err.message,
    });
  }
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.info(
    `Server is in ${process.env.NODE_ENV || 'development'} env on port ${PORT}`
  );
});

export { app, server };