import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import apiRouter from './routes/api.routes';
import { errorHandler } from './middlewares/errorHandler';
import { generalLimiter } from './middlewares/rateLimiter';

const app = express();

// ============================================================================
// SECURITY & BASIC MIDDLEWARE
// ============================================================================
app.use(helmet({
  crossOriginResourcePolicy: false, // for loading local media if needed
}));

// CORS Configuration
const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Simple Cookie Parser Middleware (removes reliance on external package)
app.use((req: any, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      req.cookies[name] = decodeURIComponent(value);
    });
  }
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ============================================================================
// RATE LIMITING & ROUTING
// ============================================================================
app.use('/api', generalLimiter);
app.use('/api', apiRouter);

// Root route health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date(), env: env.NODE_ENV });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
app.use(errorHandler);

// ============================================================================
// SERVER BOOT
// ============================================================================
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Vadhvan Port backend running in ${env.NODE_ENV} mode`);
  console.log(`🔌 Listening on port ${PORT}`);
  console.log(`==================================================`);
});

export default app;
