import express from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { Order, OrderItem, OrderStatus } from '../../src/types/database.js';
import { sendEmailNotification } from '../utils/email.js';

const router = express.Router();

const CreateOrderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  shippingAddress: z.string().min(3, 'Shipping address is required'),
  city: z.string().default('Addis Ababa'),
  subCity: z.string().optional(),
  orderType: z.enum(['PURCHASE', 'QUOTE_REQUEST']).default('PURCHASE'),
  paymentMethod: z.enum(['TELEBIRR', 'CBE_BIRR', 'CASH_ON_DELIVERY', 'BANK_TRANSFER', 'INVOICE_QUOTE']).default('TELEBIRR'),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })).min(1, 'At least one item is required in the cart'),
  notes: z.string().optional()
});

// GET /api/orders
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN'].includes(user.role);

  if (isStaff) {
    const orders = db.getOrders();
    return res.json({ orders });
  }

  const customerOrders = db.getOrdersByCustomer(user.userId);
  res.json({ orders: customerOrders });
});

// GET /api/orders/:id
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const user = req.user!;
  const isStaff = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN'].includes(user.role);

  if (!isStaff && order.customerId !== user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ order });
});

// POST /api/orders - Checkout / Place order
router.post('/', async (req: AuthRequest, res) => {
  try {
    const validated = CreateOrderSchema.parse(req.body);
    const orderNumber = db.generateOrderNumber();
    const settings = db.getSettings();

    let customerId = req.user?.userId;
    let customerName = validated.name;
    let customerEmail = validated.email.toLowerCase();

    if (!customerId) {
      const existingUser = db.getUserByEmail(customerEmail);
      if (existingUser) {
        customerId = existingUser.id;
      } else {
        const newId = `usr-cust-${Date.now()}`;
        await db.createUser({
          id: newId,
          name: customerName,
          email: customerEmail,
          passwordHash: '',
          role: 'CUSTOMER',
          phone: validated.phone,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await db.saveCustomerProfile({
          id: `cp-${Date.now()}`,
          userId: newId,
          address: validated.shippingAddress,
          city: validated.city,
          totalSpent: 0
        });
        customerId = newId;
      }
    }

    // Resolve items and calculate totals
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const itemReq of validated.items) {
      const product = db.getProductById(itemReq.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${itemReq.productId} not found.` });
      }

      if (validated.orderType === 'PURCHASE' && product.stock < itemReq.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${itemReq.quantity}`
        });
      }

      const activePrice = product.discountPrice ?? product.price;
      const total = activePrice * itemReq.quantity;
      subtotal += total;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: activePrice,
        quantity: itemReq.quantity,
        totalPrice: total
      });

      // Deduct stock if purchase
      if (validated.orderType === 'PURCHASE') {
        const newStock = product.stock - itemReq.quantity;
        await db.updateProduct(product.id, {
          stock: newStock,
          status: newStock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK'
        });

        await db.recordStockTransaction({
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'STOCK_OUT',
          quantity: itemReq.quantity,
          previousStock: product.stock,
          newStock,
          reason: `Order ${orderNumber}`,
          performedBy: customerName,
          createdAt: new Date().toISOString()
        });
      }
    }

    const taxAmount = subtotal * (settings.defaultTaxRate || 0.15);
    const deliveryFee = subtotal > 20000 ? 0 : 500; // Free delivery over 20,000 ETB
    const totalAmount = subtotal + taxAmount + deliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone: validated.phone,
      shippingAddress: validated.shippingAddress,
      city: validated.city,
      subCity: validated.subCity,
      orderType: validated.orderType,
      items: orderItems,
      subtotal,
      taxAmount,
      deliveryFee,
      totalAmount,
      paymentMethod: validated.paymentMethod,
      paymentStatus: validated.paymentMethod === 'INVOICE_QUOTE' ? 'NOT_APPLICABLE' : 'PENDING',
      status: 'PENDING',
      notes: validated.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await db.createOrder(newOrder);

    // Update customer total spent
    const profile = db.getCustomerProfileByUserId(customerId);
    if (profile) {
      await db.saveCustomerProfile({
        ...profile,
        totalSpent: (profile.totalSpent || 0) + totalAmount
      });
    }

    await db.addNotification({
      userId: 'ALL_ADMINS',
      title: `New Order: ${orderNumber}`,
      message: `${customerName} placed order ${orderNumber} for ETB ${totalAmount.toLocaleString()} via ${validated.paymentMethod}.`,
      link: `/admin/orders`,
      type: 'SUCCESS'
    });

    sendEmailNotification({
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber} | DIGITAL INSTALL`,
      template: 'ORDER_CONFIRMATION',
      data: { orderNumber, customerName, totalAmount, items: orderItems }
    });

    await db.addAuditLog({
      userId: customerId,
      userName: customerName,
      userRole: 'CUSTOMER',
      action: 'ORDER_PLACED',
      entityType: 'ORDER',
      entityId: created.id,
      details: `Placed order ${orderNumber} (${totalAmount} ETB, ${orderItems.length} items)`
    });

    res.status(201).json({ order: created, message: 'Order created successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message || 'Validation error' });
    }
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// PUT /api/orders/:id/status - Admin update order status
router.put('/:id/status', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status, paymentStatus } = req.body;

    const updated = await db.updateOrder(order.id, {
      ...(status && { status: status as OrderStatus }),
      ...(paymentStatus && { paymentStatus })
    });

    await db.addNotification({
      userId: order.customerId,
      title: `Order Update: ${order.orderNumber}`,
      message: `Your order status has been updated to ${status || order.status}.`,
      link: `/account?tab=orders`,
      type: 'INFO'
    });

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'ORDER',
      entityId: order.id,
      details: `Order ${order.orderNumber} status changed: ${status || order.status}, payment: ${paymentStatus || order.paymentStatus}`
    });

    res.json({ order: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
