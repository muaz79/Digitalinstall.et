import express from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services - Public list of services
router.get('/', (req, res) => {
  const services = db.getServices();
  res.json({ services });
});

// GET /api/services/:slug - Get single service details
router.get('/:slug', (req, res) => {
  const service = db.getServiceBySlug(req.params.slug);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ service });
});

// PUT /api/services/:id - Admin update service content
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const updated = await db.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ service: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

export default router;
