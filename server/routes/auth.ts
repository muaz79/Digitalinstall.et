import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db/database.js';
import { generateToken } from '../utils/jwt.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { sendEmailNotification } from '../utils/email.js';

const router = express.Router();

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validated = RegisterSchema.parse(req.body);

    const existing = db.getUserByEmail(validated.email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const userId = `usr-cust-${Date.now()}`;

    const newUser = await db.createUser({
      id: userId,
      name: validated.name,
      email: validated.email.toLowerCase(),
      passwordHash,
      role: 'CUSTOMER',
      phone: validated.phone || '',
      companyName: validated.companyName || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await db.saveCustomerProfile({
      id: `cp-${Date.now()}`,
      userId,
      address: validated.address || '',
      city: validated.city || 'Addis Ababa',
      totalSpent: 0
    });

    await db.addAuditLog({
      userId,
      userName: newUser.name,
      userRole: 'CUSTOMER',
      action: 'USER_REGISTERED',
      entityType: 'AUTH',
      entityId: userId,
      details: `New customer registered: ${newUser.name} (${newUser.email})`
    });

    sendEmailNotification({
      to: newUser.email,
      subject: 'Welcome to DIGITAL INSTALL - Engineering & Technology Solutions',
      template: 'WELCOME',
      data: { name: newUser.name }
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { passwordHash: _, ...userWithoutPass } = newUser;
    res.status(201).json({ user: userWithoutPass, token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const user = db.getUserByEmail(validated.email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await db.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'AUTH',
      entityId: user.id,
      details: `User logged in: ${user.name} (${user.role})`
    });

    const { passwordHash: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res) => {
  const user = db.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const customerProfile = db.getCustomerProfileByUserId(user.id);
  const staffProfile = db.getStaffProfiles().find(s => s.userId === user.id);

  const { passwordHash: _, ...userWithoutPass } = user;
  res.json({
    user: userWithoutPass,
    customerProfile,
    staffProfile
  });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, companyName, address, city, subCity, tinNumber } = req.body;
    const updatedUser = await db.updateUser(req.user!.userId, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(companyName !== undefined && { companyName })
    });

    if (address !== undefined || city !== undefined || subCity !== undefined || tinNumber !== undefined) {
      const existingProfile = db.getCustomerProfileByUserId(req.user!.userId);
      await db.saveCustomerProfile({
        id: existingProfile?.id || `cp-${Date.now()}`,
        userId: req.user!.userId,
        address: address ?? existingProfile?.address,
        city: city ?? existingProfile?.city,
        subCity: subCity ?? existingProfile?.subCity,
        tinNumber: tinNumber ?? existingProfile?.tinNumber,
        totalSpent: existingProfile?.totalSpent || 0,
        notes: existingProfile?.notes
      });
    }

    const { passwordHash: _, ...userWithoutPass } = updatedUser!;
    res.json({ user: userWithoutPass });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
