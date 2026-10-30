import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { initializeDatabase } from './db/database.js';
import { initPostgres } from './db/postgres.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { simulatorRouter } from './routes/simulator.js';
import { statsRouter } from './routes/stats.js';
import { simulator } from './services/simulator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database schema and initial data
initializeDatabase();

// Initialize PostgreSQL connection and orders table (for DataTrace monitoring)
initPostgres().catch(err => console.warn('[PostgreSQL] Init warning:', err.message));

// Mount API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/stats', statsRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'DataTrace Store Backend & Order Generator',
    time: new Date().toISOString(),
    simulator: simulator.getStatus()
  });
});

// Serve frontend in production build if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` DataTrace Store API Server running on port ${PORT}`);
  console.log(` API URL: http://localhost:${PORT}/api`);
  console.log(` Health:  http://localhost:${PORT}/api/health`);
  console.log(` Stream:  http://localhost:${PORT}/api/simulator/stream`);
  console.log(`====================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Stopping simulator and closing server...');
  simulator.stop();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Stopping simulator and closing server...');
  simulator.stop();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

