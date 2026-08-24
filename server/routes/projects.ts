import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { Project, ProjectStatus, Warranty } from '../../src/types/database.js';

const router = express.Router();

// GET /api/projects - List projects (Public/Customer/Staff)
router.get('/', (req: AuthRequest, res) => {
  const user = req.user;
  const isPublic = !user;
  const isCustomer = user?.role === 'CUSTOMER';
  const isStaff = user && ['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN', 'SHOP_MANAGER'].includes(user.role);

  if (isPublic) {
    // Return featured or public case studies
    const all = db.getProjects();
    return res.json({ projects: all });
  }

  if (isCustomer) {
    const customerProjects = db.getProjectsByCustomer(user.userId);
    return res.json({ projects: customerProjects });
  }

  if (isStaff) {
    if (user.role === 'TECHNICIAN') {
      const assigned = db.getProjectsByTechnician(user.userId);
      return res.json({ projects: assigned });
    }
    const all = db.getProjects();
    return res.json({ projects: all });
  }

  res.json({ projects: [] });
});

// GET /api/projects/:id
router.get('/:id', (req: AuthRequest, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const user = req.user;
  if (user && user.role === 'CUSTOMER' && project.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ project });
});

// POST /api/projects - Admin creates project
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES']), async (req: AuthRequest, res) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      title,
      type,
      location,
      description,
      scopeOfWork,
      budget,
      startDate,
      targetCompletionDate,
      assignedTechnicianIds,
      assignedTechnicianNames
    } = req.body;

    const projectNumber = db.generateProjectNumber();

    const newProject: Project = {
      id: `prj-${Date.now()}`,
      projectNumber,
      customerId: customerId || req.user!.userId,
      customerName: customerName || req.user!.name,
      customerEmail: customerEmail || req.user!.email,
      customerPhone,
      title,
      type: type || 'COMMERCIAL',
      location,
      description,
      scopeOfWork: scopeOfWork || [],
      budget: Number(budget) || 0,
      startDate: startDate || new Date().toISOString(),
      targetCompletionDate: targetCompletionDate || new Date().toISOString(),
      assignedTechnicianIds: assignedTechnicianIds || ['usr-tech-01'],
      assignedTechnicianNames: assignedTechnicianNames || ['Dawit Bekele'],
      status: 'PLANNING',
      progressPercentage: 0,
      milestones: [
        { id: 'm1', title: 'Site Inspection & Engineering Blueprints', status: 'IN_PROGRESS' },
        { id: 'm2', title: 'Materials Procurement & Conduit Infrastructure', status: 'PENDING' },
        { id: 'm3', title: 'Equipment Installation & Distribution Board Wiring', status: 'PENDING' },
        { id: 'm4', title: 'System Calibration, Testing & Smart Setup', status: 'PENDING' },
        { id: 'm5', title: 'Final Handover, Training & Warranty Registration', status: 'PENDING' }
      ],
      photos: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await db.createProject(newProject);

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: created.id,
      details: `Created new project ${projectNumber}: ${title}`
    });

    res.status(201).json({ project: created });
  } catch (err: any) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Admin / Technician update project status, milestones, photos
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES', 'TECHNICIAN']), async (req: AuthRequest, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      status,
      progressPercentage,
      milestones,
      photos,
      documents,
      assignedTechnicianIds,
      assignedTechnicianNames,
      title,
      description
    } = req.body;

    const isCompletedNow = status === 'COMPLETED' && project.status !== 'COMPLETED';

    const updated = await db.updateProject(project.id, {
      ...(status && { status: status as ProjectStatus }),
      ...(progressPercentage !== undefined && { progressPercentage: Number(progressPercentage) }),
      ...(milestones && { milestones }),
      ...(photos && { photos }),
      ...(documents && { documents }),
      ...(assignedTechnicianIds && { assignedTechnicianIds }),
      ...(assignedTechnicianNames && { assignedTechnicianNames }),
      ...(title && { title }),
      ...(description && { description }),
      ...(isCompletedNow && { actualCompletionDate: new Date().toISOString() })
    });

    // Notify customer
    await db.addNotification({
      userId: project.customerId,
      title: `Project Update: ${project.projectNumber}`,
      message: `Project status updated to ${status || project.status} (${progressPercentage ?? project.progressPercentage}% completed).`,
      link: `/account?tab=projects`,
      type: 'INFO'
    });

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: project.id,
      details: `Project ${project.projectNumber} updated. Status: ${status || project.status}, Progress: ${progressPercentage ?? project.progressPercentage}%`
    });

    res.json({ project: updated });
  } catch (err: any) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// POST /api/projects/:id/register-warranty - Register official warranty for completed project
router.post('/:id/register-warranty', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']), async (req: AuthRequest, res) => {
  try {
    const project = db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { warrantyMonths = 24, coverageDetails, serialNumber } = req.body;
    const warrantyNumber = db.generateWarrantyNumber();
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + warrantyMonths * 30 * 24 * 60 * 60 * 1000).toISOString();

    const newWarranty: Warranty = {
      id: `wr-${Date.now()}`,
      warrantyNumber,
      customerId: project.customerId,
      customerName: project.customerName,
      customerEmail: project.customerEmail,
      customerPhone: project.customerPhone,
      projectId: project.id,
      projectName: project.title,
      productName: `${project.title} - Turnkey Installation`,
      serialNumber: serialNumber || `SN-${project.projectNumber}-${Date.now().toString().slice(-4)}`,
      installationDate: project.actualCompletionDate || startDate,
      startDate,
      endDate,
      warrantyType: 'COMPREHENSIVE',
      coverageDetails: coverageDetails || `Full ${warrantyMonths}-month workmanship and equipment warranty for project ${project.projectNumber}.`,
      status: 'ACTIVE',
      claimsCount: 0,
      createdAt: new Date().toISOString()
    };

    const createdWarranty = await db.createWarranty(newWarranty);

    await db.addNotification({
      userId: project.customerId,
      title: `Warranty Registered: ${warrantyNumber}`,
      message: `Your project ${project.projectNumber} now has an active ${warrantyMonths}-month warranty certificate (${warrantyNumber}).`,
      link: `/account?tab=warranties`,
      type: 'SUCCESS'
    });

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'WARRANTY_REGISTERED',
      entityType: 'WARRANTY',
      entityId: createdWarranty.id,
      details: `Issued warranty ${warrantyNumber} for project ${project.projectNumber}`
    });

    res.status(201).json({ warranty: createdWarranty, message: 'Warranty registered successfully' });
  } catch (err: any) {
    console.error('Register warranty error:', err);
    res.status(500).json({ error: 'Failed to register warranty' });
  }
});

export default router;
