import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { SupportTicket, SupportMessage, TicketPriority, TicketStatus, TicketCategory } from '../../src/types/database.js';
import { sendEmailNotification } from '../utils/email.js';

const router = express.Router();

const CreateTicketSchema = z.object({
  category: z.enum(['Electrical', 'CCTV', 'Network', 'Wi-Fi', 'Computer', 'Software', 'Warranty', 'Other']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message details must be at least 10 characters'),
  attachments: z.array(z.string()).optional()
});

// GET /api/tickets
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN'].includes(user.role);

  if (isStaff) {
    if (user.role === 'TECHNICIAN') {
      const tickets = db.getTickets();
      return res.json({ tickets });
    }
    const tickets = db.getTickets();
    return res.json({ tickets });
  }

  const customerTickets = db.getTicketsByCustomer(user.userId);
  res.json({ tickets: customerTickets });
});

// GET /api/tickets/:id
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const ticket = db.getTicketById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN'].includes(user.role);

  if (!isStaff && ticket.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ ticket });
});

// POST /api/tickets - Customer creates ticket
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const validated = CreateTicketSchema.parse(req.body);
    const ticketNumber = db.generateTicketNumber();
    const user = req.user!;

    const initialMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticketId: '',
      senderId: user.userId,
      senderName: user.name,
      senderRole: user.role,
      message: validated.message,
      attachments: validated.attachments || [],
      createdAt: new Date().toISOString()
    };

    const newTicket: SupportTicket = {
      id: `tk-${Date.now()}`,
      ticketNumber,
      customerId: user.userId,
      customerName: user.name,
      customerEmail: user.email,
      category: validated.category,
      priority: validated.priority,
      status: 'OPEN',
      subject: validated.subject,
      initialMessage: validated.message,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    initialMsg.ticketId = newTicket.id;
    newTicket.messages.push(initialMsg);

    const created = await db.createTicket(newTicket);

    await db.addNotification({
      userId: 'ALL_ADMINS',
      title: `New Support Ticket: ${ticketNumber}`,
      message: `${user.name} opened ticket ${ticketNumber} [${validated.category} / ${validated.priority}]: ${validated.subject}`,
      link: `/admin/support`,
      type: validated.priority === 'URGENT' ? 'ALERT' : 'INFO'
    });

    await db.addAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'TICKET_CREATED',
      entityType: 'TICKET',
      entityId: created.id,
      details: `Created support ticket ${ticketNumber}: ${validated.subject}`
    });

    res.status(201).json({ ticket: created, message: 'Support ticket submitted successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    console.error('Create ticket error:', err);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

// POST /api/tickets/:id/messages - Reply to ticket
router.post('/:id/messages', requireAuth, async (req: AuthRequest, res) => {
  try {
    const ticket = db.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const user = req.user!;
    const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

    if (!isStaff && ticket.customerId !== user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { message, attachments } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticketId: ticket.id,
      senderId: user.userId,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      attachments: attachments || [],
      createdAt: new Date().toISOString()
    };

    const newStatus: TicketStatus = isStaff
      ? (ticket.status === 'OPEN' ? 'ASSIGNED' : 'WAITING_CUSTOMER')
      : 'IN_PROGRESS';

    const updated = await db.addTicketMessage(ticket.id, newMsg);
    await db.updateTicket(ticket.id, { status: newStatus });

    // Send notifications
    if (isStaff) {
      await db.addNotification({
        userId: ticket.customerId,
        title: `Reply on Ticket: ${ticket.ticketNumber}`,
        message: `${user.name} replied to your support ticket.`,
        link: `/account?tab=support`,
        type: 'INFO'
      });

      sendEmailNotification({
        to: ticket.customerEmail,
        subject: `New Response on Ticket ${ticket.ticketNumber} | DIGITAL INSTALL`,
        template: 'SUPPORT_REPLY',
        data: { ticketNumber: ticket.ticketNumber, staffName: user.name, message }
      });
    } else {
      await db.addNotification({
        userId: ticket.assignedStaffId || 'ALL_ADMINS',
        title: `Customer Reply: ${ticket.ticketNumber}`,
        message: `${ticket.customerName} replied to ticket ${ticket.ticketNumber}.`,
        link: `/admin/support`,
        type: 'INFO'
      });
    }

    res.status(201).json({ message: newMsg, ticket: db.getTicketById(ticket.id) });
  } catch (err: any) {
    console.error('Ticket reply error:', err);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

// PUT /api/tickets/:id/status - Update status, priority or technician
router.put('/:id/status', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']), async (req: AuthRequest, res) => {
  try {
    const ticket = db.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const { status, priority, assignedStaffId, assignedStaffName } = req.body;

    const isResolved = status === 'RESOLVED' || status === 'CLOSED';

    const updated = await db.updateTicket(ticket.id, {
      ...(status && { status: status as TicketStatus }),
      ...(priority && { priority: priority as TicketPriority }),
      ...(assignedStaffId !== undefined && { assignedStaffId }),
      ...(assignedStaffName !== undefined && { assignedStaffName }),
      ...(isResolved && { resolvedAt: new Date().toISOString() })
    });

    res.json({ ticket: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

export default router;
