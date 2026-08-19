import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth';
import { customerRouter } from './routes/customers';
import { menuRouter } from './routes/menu';
import { subscriptionRouter } from './routes/subscriptions';
import { orderRouter } from './routes/orders';
import { vendorRouter } from './routes/vendors';
import { deliveryRouter } from './routes/delivery';
import { paymentRouter } from './routes/payments';
import { expenseRouter } from './routes/expenses';
import { inventoryRouter } from './routes/inventory';
import { reviewRouter } from './routes/reviews';
import { settingsRouter } from './routes/settings';
import { reportRouter } from './routes/reports';
import { db } from './db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS & Preflight Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Homly Food Tiffin CRM API',
    version: '1.0.0',
    stats: {
      users: db.users.length,
      menuItems: db.menu.length,
      orders: db.orders.length,
      subscriptions: db.subscriptions.length,
      vendors: db.vendors.length
    }
  });
});

// Mount API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/plans', subscriptionRouter); // alias
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/vendors', vendorRouter);
app.use('/api/v1/delivery', deliveryRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/reports', reportRouter);

// 404 Handler for undefined API routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Serve frontend static files in production (Render Fullstack)
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all for SPA React Router navigation
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head><title>Homly Food API Server</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>🍲 Homly Food API Server is Active</h2>
        <p>API endpoints are live at <a href="/api/v1/health">/api/v1/health</a></p>
      </body>
    </html>
  `);
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Homly Food Full-Stack App running on port ${PORT}`);
    console.log(`👉 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`👉 Base API URL: http://localhost:${PORT}/api/v1`);
    console.log(`====================================================`);
  });
}

export default app;
