import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { ContactMessage } from '../../src/types/database.js';

const router = express.Router();

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  service: z.string().min(2, 'Service selection is required'),
  location: z.string().min(2, 'Location is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// POST /api/contact - Public contact submission
router.post('/', async (req, res) => {
  try {
    const validated = ContactSchema.parse(req.body);

    const newMsg: ContactMessage = {
      id: `cm-${Date.now()}`,
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      service: validated.service,
      location: validated.location,
      message: validated.message,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    const created = await db.createContactMessage(newMsg);

    await db.addNotification({
      userId: 'ALL_ADMINS',
      title: `New Inquiry from ${validated.name}`,
      message: `Inquiry regarding ${validated.service} in ${validated.location}: "${validated.message.slice(0, 80)}..."`,
      link: `/admin/dashboard`,
      type: 'INFO'
    });

    res.status(201).json({ message: 'Thank you for reaching out! Our engineering team will contact you within 24 hours.', data: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// GET /api/contact - Admin view messages
router.get('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES']), (req, res) => {
  const messages = db.getContactMessages();
  res.json({ messages });
});

// PUT /api/contact/:id - Admin update status
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES']), async (req, res) => {
  const { status } = req.body;
  const updated = await db.updateContactMessage(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Message not found' });
  }
  res.json({ message: updated });
});

export default router;
