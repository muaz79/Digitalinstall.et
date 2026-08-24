import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/database.js';
import { authenticate } from './server/middleware/auth.js';

import authRoutes from './server/routes/auth.js';
import quoteRoutes from './server/routes/quotes.js';
import projectRoutes from './server/routes/projects.js';
import productRoutes from './server/routes/products.js';
import orderRoutes from './server/routes/orders.js';
import warrantyRoutes from './server/routes/warranties.js';
import ticketRoutes from './server/routes/tickets.js';
import serviceRoutes from './server/routes/services.js';
import settingRoutes from './server/routes/settings.js';
import contactRoutes from './server/routes/contact.js';
import adminRoutes from './server/routes/admin.js';
import documentRoutes from './server/routes/documents.js';

async function startServer() {
  // Initialize Database
  await db.init();

  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());
  app.use(authenticate);

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DIGITAL INSTALL Engineering Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/quotes', quoteRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/warranties', warrantyRoutes);
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/settings', settingRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/documents', documentRoutes);

  // Serve Vite in development or static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ DIGITAL INSTALL Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
