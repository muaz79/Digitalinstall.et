import express from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { Warranty, WarrantyClaim } from '../../src/types/database.js';

const router = express.Router();

// GET /api/warranties - List warranties (Customer gets own, Admin gets all)
router.get('/', (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Sign in to view warranties' });
  }

  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);
  if (isStaff) {
    const warranties = db.getWarranties();
    return res.json({ warranties });
  }

  const customerWarranties = db.getWarrantiesByCustomer(user.userId);
  res.json({ warranties: customerWarranties });
});

// GET /api/warranties/verify - Public warranty lookup by number or serial
router.get('/verify', (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Warranty number or serial is required' });
  }

  const cleanQuery = query.trim();
  const warranty = db.getWarrantyByNumber(cleanQuery) || db.getWarrantyBySerial(cleanQuery);

  if (!warranty) {
    return res.status(404).json({
      found: false,
      message: `No active warranty found matching '${cleanQuery}'. Please double check your certificate or contact support.`
    });
  }

  const now = new Date();
  const endDate = new Date(warranty.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  res.json({
    found: true,
    warranty: {
      warrantyNumber: warranty.warrantyNumber,
      customerName: warranty.customerName,
      productName: warranty.productName,
      projectName: warranty.projectName,
      serialNumber: warranty.serialNumber,
      installationDate: warranty.installationDate,
      startDate: warranty.startDate,
      endDate: warranty.endDate,
      warrantyType: warranty.warrantyType,
      coverageDetails: warranty.coverageDetails,
      status: daysRemaining < 0 ? 'EXPIRED' : warranty.status,
      daysRemaining: Math.max(0, daysRemaining)
    }
  });
});

// POST /api/warranties/claim - Customer submits claim
router.post('/claim', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { warrantyId, issueDescription, attachments } = req.body;
    if (!warrantyId || !issueDescription) {
      return res.status(400).json({ error: 'Warranty ID and issue description are required' });
    }

    const warranty = db.getWarrantyById(warrantyId);
    if (!warranty) {
      return res.status(404).json({ error: 'Warranty record not found' });
    }

    const claimNumber = db.generateClaimNumber();

    const newClaim: WarrantyClaim = {
      id: `clm-${Date.now()}`,
      claimNumber,
      warrantyId: warranty.id,
      warrantyNumber: warranty.warrantyNumber,
      customerId: req.user!.userId,
      customerName: req.user!.name,
      issueDescription,
      attachments: attachments || [],
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    const created = await db.createWarrantyClaim(newClaim);

    await db.addNotification({
      userId: 'ALL_ADMINS',
      title: `Warranty Claim: ${claimNumber}`,
      message: `${req.user!.name} submitted warranty claim ${claimNumber} for ${warranty.warrantyNumber}.`,
      link: `/admin/warranty`,
      type: 'ALERT'
    });

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'WARRANTY_CLAIM_SUBMITTED',
      entityType: 'WARRANTY',
      entityId: warranty.id,
      details: `Submitted claim ${claimNumber} for warranty ${warranty.warrantyNumber}`
    });

    res.status(201).json({ claim: created, message: 'Warranty claim submitted successfully. Our engineering team will review it.' });
  } catch (err: any) {
    console.error('Warranty claim error:', err);
    res.status(500).json({ error: 'Failed to submit warranty claim' });
  }
});

// GET /api/warranties/claims - List claims
router.get('/claims', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  const allClaims = db.getWarrantyClaims();
  if (isStaff) {
    return res.json({ claims: allClaims });
  }

  const customerClaims = allClaims.filter(c => c.customerId === user.userId);
  res.json({ claims: customerClaims });
});

// PUT /api/warranties/claims/:id - Update claim status
router.put('/claims/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']), async (req: AuthRequest, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await db.updateWarrantyClaim(req.params.id, {
      ...(status && { status }),
      ...(adminNotes !== undefined && { adminNotes }),
      ...(status === 'APPROVED' || status === 'REPLACED' || status === 'REJECTED' ? { resolvedAt: new Date().toISOString() } : {})
    });

    if (!updated) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    await db.addNotification({
      userId: updated.customerId,
      title: `Warranty Claim Update: ${updated.claimNumber}`,
      message: `Your claim ${updated.claimNumber} status has been updated to ${status}.`,
      link: `/account?tab=warranties`,
      type: 'INFO'
    });

    res.json({ claim: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

export default router;
