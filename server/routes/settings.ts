import express from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings - Public company settings
router.get('/', (req, res) => {
  const settings = db.getSettings();
  res.json({ settings });
});

// PUT /api/settings - Admin update company settings
router.put('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const updated = await db.updateSettings(req.body);

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'SETTINGS_UPDATED',
      entityType: 'SETTINGS',
      details: `Company configuration updated by ${req.user!.name}`
    });

    res.json({ settings: updated, message: 'Settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
