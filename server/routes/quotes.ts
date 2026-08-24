import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { Quote, QuoteItem, QuoteStatus, Project } from '../../src/types/database.js';
import { sendEmailNotification } from '../utils/email.js';

const router = express.Router();

const CreateQuoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  location: z.string().min(2, 'Location/City is required'),
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL']).default('RESIDENTIAL'),
  requiredServices: z.array(z.string()).min(1, 'Please select at least one service'),
  projectDescription: z.string().min(10, 'Please describe your project requirements'),
  estimatedBudget: z.string().optional(),
  preferredDate: z.string().optional(),
  customerNotes: z.string().optional(),
  attachments: z.array(z.string()).optional()
});

// GET /api/quotes - List quotes (Customer gets own, Admin/Sales/Tech get all)
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (isStaff) {
    const quotes = db.getQuotes();
    return res.json({ quotes });
  }

  // Customer isolation
  const quotes = db.getQuotesByCustomer(user.userId);
  return res.json({ quotes });
});

// GET /api/quotes/:id
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quotation not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (!isStaff && quote.customerId !== user.userId) {
    return res.status(403).json({ error: 'Access forbidden.' });
  }

  res.json({ quote });
});

// POST /api/quotes - Submit new quote request
router.post('/', async (req: AuthRequest, res) => {
  try {
    const validated = CreateQuoteSchema.parse(req.body);
    const quoteNumber = db.generateQuoteNumber();
    const settings = db.getSettings();

    let customerId = req.user?.userId;
    let customerName = validated.name;
    let customerEmail = validated.email.toLowerCase();
    let customerPhone = validated.phone;

    // If guest, find or create customer
    if (!customerId) {
      const existingUser = db.getUserByEmail(customerEmail);
      if (existingUser) {
        customerId = existingUser.id;
      } else {
        // Auto-create customer account so they can track quote
        const newId = `usr-cust-${Date.now()}`;
        await db.createUser({
          id: newId,
          name: customerName,
          email: customerEmail,
          passwordHash: '', // Can set later via forgot password
          role: 'CUSTOMER',
          phone: customerPhone,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await db.saveCustomerProfile({
          id: `cp-${Date.now()}`,
          userId: newId,
          address: validated.location,
          totalSpent: 0
        });
        customerId = newId;
      }
    }

    const newQuote: Quote = {
      id: `qt-${Date.now()}`,
      quoteNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation: validated.location,
      propertyType: validated.propertyType,
      requiredServices: validated.requiredServices,
      projectDescription: validated.projectDescription,
      estimatedBudget: validated.estimatedBudget || '',
      preferredDate: validated.preferredDate || '',
      attachments: validated.attachments || [],
      customerNotes: validated.customerNotes || '',
      status: 'NEW',
      items: [],
      subtotal: 0,
      taxRate: settings.defaultTaxRate || 0.15,
      taxAmount: 0,
      discount: 0,
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await db.createQuote(newQuote);

    // Notify admins
    await db.addNotification({
      userId: 'ALL_ADMINS',
      title: `New Quotation Request ${quoteNumber}`,
      message: `${customerName} requested a quote for ${validated.requiredServices.join(', ')} in ${validated.location}.`,
      link: `/admin/quotes`,
      type: 'INFO'
    });

    await db.addAuditLog({
      userId: customerId,
      userName: customerName,
      userRole: 'CUSTOMER',
      action: 'QUOTE_SUBMITTED',
      entityType: 'QUOTE',
      entityId: created.id,
      details: `New quotation submitted ${quoteNumber} by ${customerName}`
    });

    sendEmailNotification({
      to: customerEmail,
      subject: `Quotation Request Received - ${quoteNumber} | DIGITAL INSTALL`,
      template: 'QUOTE_SUBMITTED',
      data: { quoteNumber, customerName, services: validated.requiredServices }
    });

    res.status(201).json({ quote: created, message: 'Quote request submitted successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    console.error('Create quote error:', err);
    res.status(500).json({ error: 'Failed to create quote request' });
  }
});

// PUT /api/quotes/:id - Admin update quote pricing & status
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  try {
    const quote = db.getQuoteById(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const {
      status,
      assignedStaffId,
      assignedStaffName,
      items,
      discount,
      adminNotes,
      validUntil
    } = req.body;

    let updatedItems: QuoteItem[] = quote.items;
    let subtotal = quote.subtotal;
    let discountAmount = discount !== undefined ? Number(discount) : quote.discount;
    const taxRate = quote.taxRate || 0.15;

    if (items && Array.isArray(items)) {
      updatedItems = items.map((it: any, index: number) => {
        const qty = Number(it.quantity) || 1;
        const up = Number(it.unitPrice) || 0;
        return {
          id: it.id || `qi-${Date.now()}-${index}`,
          description: it.description || 'Service/Material Item',
          serviceId: it.serviceId,
          type: it.type || 'MATERIAL',
          quantity: qty,
          unit: it.unit || 'Unit',
          unitPrice: up,
          totalPrice: qty * up
        };
      });

      subtotal = updatedItems.reduce((acc, it) => acc + it.totalPrice, 0);
    }

    const taxAmount = (subtotal - discountAmount) * taxRate;
    const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);

    const updated = await db.updateQuote(quote.id, {
      ...(status && { status: status as QuoteStatus }),
      ...(assignedStaffId !== undefined && { assignedStaffId }),
      ...(assignedStaffName !== undefined && { assignedStaffName }),
      items: updatedItems,
      subtotal,
      discount: discountAmount,
      taxAmount,
      totalAmount,
      ...(adminNotes !== undefined && { adminNotes }),
      ...(validUntil !== undefined && { validUntil })
    });

    if (status === 'QUOTED' && quote.status !== 'QUOTED') {
      // Notify customer that quotation is ready
      await db.addNotification({
        userId: quote.customerId,
        title: `Quotation Ready: ${quote.quoteNumber}`,
        message: `Your quotation ${quote.quoteNumber} for ETB ${totalAmount.toLocaleString()} is ready for your digital review and approval.`,
        link: `/account?tab=quotes`,
        type: 'SUCCESS'
      });

      sendEmailNotification({
        to: quote.customerEmail,
        subject: `Your Quotation ${quote.quoteNumber} is Ready for Approval | DIGITAL INSTALL`,
        template: 'QUOTE_READY',
        data: { quoteNumber: quote.quoteNumber, totalAmount, name: quote.customerName }
      });
    }

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'QUOTE_UPDATED',
      entityType: 'QUOTE',
      entityId: quote.id,
      details: `Quote ${quote.quoteNumber} updated by ${req.user!.name}. Status: ${status || quote.status}, Total: ${totalAmount} ETB`
    });

    res.json({ quote: updated, message: 'Quote updated successfully' });
  } catch (err: any) {
    console.error('Update quote error:', err);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// POST /api/quotes/:id/approve - Customer approves quotation
router.post('/:id/approve', requireAuth, async (req: AuthRequest, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  const user = req.user!;
  if (quote.customerId !== user.userId && !['SUPER_ADMIN', 'ADMIN', 'SALES'].includes(user.role)) {
    return res.status(403).json({ error: 'Unauthorized to approve this quotation.' });
  }

  const updated = await db.updateQuote(quote.id, {
    status: 'APPROVED',
    approvedAt: new Date().toISOString()
  });

  await db.addNotification({
    userId: 'ALL_ADMINS',
    title: `Quotation Approved! ${quote.quoteNumber}`,
    message: `${quote.customerName} approved quotation ${quote.quoteNumber} (${quote.totalAmount.toLocaleString()} ETB). Ready for project conversion.`,
    link: `/admin/quotes`,
    type: 'SUCCESS'
  });

  await db.addAuditLog({
    userId: user.userId,
    userName: user.name,
    userRole: user.role,
    action: 'QUOTE_APPROVED',
    entityType: 'QUOTE',
    entityId: quote.id,
    details: `Quotation ${quote.quoteNumber} approved by ${user.name}`
  });

  res.json({ quote: updated, message: 'Quotation approved successfully! Our project engineering team will contact you shortly.' });
});

// POST /api/quotes/:id/reject - Customer rejects quotation
router.post('/:id/reject', requireAuth, async (req: AuthRequest, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  const user = req.user!;
  if (quote.customerId !== user.userId && !['SUPER_ADMIN', 'ADMIN', 'SALES'].includes(user.role)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { reason } = req.body;

  const updated = await db.updateQuote(quote.id, {
    status: 'REJECTED',
    rejectedReason: reason || 'Customer declined proposal'
  });

  await db.addAuditLog({
    userId: user.userId,
    userName: user.name,
    userRole: user.role,
    action: 'QUOTE_REJECTED',
    entityType: 'QUOTE',
    entityId: quote.id,
    details: `Quotation ${quote.quoteNumber} rejected: ${reason || 'No reason provided'}`
  });

  res.json({ quote: updated, message: 'Quotation status updated' });
});

// POST /api/quotes/:id/convert-to-project - Admin converts approved quote to Project
router.post('/:id/convert-to-project', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  if (quote.convertedProjectId) {
    return res.status(400).json({ error: 'This quotation has already been converted to a project.' });
  }

  const projectNumber = db.generateProjectNumber();
  const startDate = new Date().toISOString();
  const targetCompletion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const newProject: Project = {
    id: `prj-${Date.now()}`,
    projectNumber,
    customerId: quote.customerId,
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone,
    quoteId: quote.id,
    title: `${quote.customerName} - ${quote.requiredServices.join(' & ')}`,
    type: quote.propertyType,
    location: quote.customerLocation,
    description: quote.projectDescription,
    scopeOfWork: quote.items.map(i => `${i.quantity}x ${i.description}`),
    budget: quote.totalAmount,
    startDate,
    targetCompletionDate: targetCompletion,
    assignedTechnicianIds: quote.assignedStaffId ? [quote.assignedStaffId] : ['usr-tech-01'],
    assignedTechnicianNames: quote.assignedStaffName ? [quote.assignedStaffName] : ['Dawit Bekele'],
    status: 'PLANNING',
    progressPercentage: 10,
    milestones: [
      { id: 'm1', title: 'Site Inspection & Engineering Blueprints', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 'm2', title: 'Materials Procurement & Conduit Infrastructure', status: 'PENDING', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 'm3', title: 'Equipment Installation & Distribution Board Wiring', status: 'PENDING', dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 'm4', title: 'System Calibration, Testing & Smart Setup', status: 'PENDING', dueDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 'm5', title: 'Final Handover, Training & Warranty Registration', status: 'PENDING', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ],
    photos: [],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const createdProject = await db.createProject(newProject);

  await db.updateQuote(quote.id, {
    status: 'APPROVED',
    convertedProjectId: createdProject.id
  });

  await db.addNotification({
    userId: quote.customerId,
    title: `Project Initiated: ${projectNumber}`,
    message: `Your project ${projectNumber} is now officially registered! You can track live milestones and technician updates in your portal.`,
    link: `/account?tab=projects`,
    type: 'SUCCESS'
  });

  await db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'PROJECT_CREATED_FROM_QUOTE',
    entityType: 'PROJECT',
    entityId: createdProject.id,
    details: `Converted quote ${quote.quoteNumber} to Project ${projectNumber}`
  });

  res.status(201).json({ project: createdProject, message: 'Quote converted to Project successfully' });
});

export default router;
