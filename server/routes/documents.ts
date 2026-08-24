import express from 'express';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/documents/quote/:id - Printable quote document data
router.get('/quote/:id', requireAuth, (req: AuthRequest, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (!isStaff && quote.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const settings = db.getSettings();
  res.json({
    documentType: 'QUOTATION',
    quote,
    company: settings
  });
});

// GET /api/documents/order/:id - Printable invoice document data
router.get('/order/:id', requireAuth, (req: AuthRequest, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (!isStaff && order.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const settings = db.getSettings();
  res.json({
    documentType: 'TAX_INVOICE',
    order,
    company: settings
  });
});

// GET /api/documents/warranty/:id - Printable warranty certificate
router.get('/warranty/:id', requireAuth, (req: AuthRequest, res) => {
  const warranty = db.getWarrantyById(req.params.id);
  if (!warranty) {
    return res.status(404).json({ error: 'Warranty not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (!isStaff && warranty.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const settings = db.getSettings();
  res.json({
    documentType: 'WARRANTY_CERTIFICATE',
    warranty,
    company: settings
  });
});

// GET /api/documents/project/:id - Printable project handover report
router.get('/project/:id', requireAuth, (req: AuthRequest, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (!isStaff && project.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const settings = db.getSettings();
  res.json({
    documentType: 'PROJECT_COMPLETION_REPORT',
    project,
    company: settings
  });
});

export default router;
