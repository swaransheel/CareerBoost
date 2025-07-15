import 'dotenv/config';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { db } from '../server/db';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Register API routes
registerRoutes(app);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
