import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { UserRole } from '../../src/types/database.js';

const router = express.Router();

// GET /api/admin/metrics - Comprehensive dashboard metrics
router.get('/metrics', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN']), (req, res) => {
  const users = db.getUsers();
  const customers = users.filter(u => u.role === 'CUSTOMER');
  const quotes = db.getQuotes();
  const projects = db.getProjects();
  const orders = db.getOrders();
  const products = db.getProducts();
  const warranties = db.getWarranties();
  const tickets = db.getTickets();

  const newQuotesCount = quotes.filter(q => q.status === 'NEW' || q.status === 'REVIEWING').length;
  const activeProjectsCount = projects.filter(p => p.status !== 'COMPLETED').length;
  const openTicketsCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
  const urgentTicketsCount = tickets.filter(t => (t.status === 'OPEN' || t.status === 'ASSIGNED') && (t.priority === 'URGENT' || t.priority === 'HIGH')).length;
  const activeWarrantiesCount = warranties.filter(w => w.status === 'ACTIVE').length;

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  // Revenue calculation from delivered/processing orders + approved/completed quotes
  const orderRevenue = orders
    .filter(o => o.status !== 'CANCELLED' && o.orderType === 'PURCHASE')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const projectRevenue = projects
    .reduce((sum, p) => sum + p.budget, 0);

  const totalRevenue = orderRevenue + projectRevenue;

  // Pipeline value
  const pipelineQuoteValue = quotes
    .filter(q => q.status === 'QUOTED' || q.status === 'APPROVED')
    .reduce((sum, q) => sum + q.totalAmount, 0);

  res.json({
    metrics: {
      totalCustomers: customers.length,
      newQuotes: newQuotesCount,
      totalQuotes: quotes.length,
      activeProjects: activeProjectsCount,
      totalProjects: projects.length,
      totalOrders: orders.length,
      openTickets: openTicketsCount,
      urgentTickets: urgentTicketsCount,
      activeWarranties: activeWarrantiesCount,
      lowStockCount: lowStockProducts.length,
      totalRevenue,
      orderRevenue,
      projectRevenue,
      pipelineQuoteValue
    },
    lowStockProducts: lowStockProducts.slice(0, 5),
    recentQuotes: quotes.slice(0, 5),
    recentOrders: orders.slice(0, 5),
    recentProjects: projects.slice(0, 5),
    recentTickets: tickets.slice(0, 5)
  });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
  const logs = db.getAuditLogs();
  res.json({ logs });
});

// GET /api/admin/users - User directory
router.get('/users', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
  const users = db.getUsers().map(u => {
    const { passwordHash, ...safe } = u;
    return safe;
  });
  res.json({ users });
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  const { role, isActive } = req.body;
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updated = await db.updateUser(user.id, {
    ...(role && { role: role as UserRole }),
    ...(isActive !== undefined && { isActive: Boolean(isActive) })
  });

  await db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'USER_ROLE_UPDATED',
    entityType: 'AUTH',
    entityId: user.id,
    details: `Updated user ${user.name} role to ${role || user.role}`
  });

  const { passwordHash: _, ...safe } = updated!;
  res.json({ user: safe });
});

// GET /api/admin/notifications
router.get('/notifications', requireAuth, (req: AuthRequest, res) => {
  const notifs = db.getNotifications(req.user!.userId);
  res.json({ notifications: notifs });
});

// PUT /api/admin/notifications/:id/read
router.put('/notifications/:id/read', requireAuth, async (req, res) => {
  await db.markNotificationRead(req.params.id);
  res.json({ message: 'Marked read' });
});

export default router;
