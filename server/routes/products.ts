import express from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth.js';
import { Product, InventoryTransaction } from '../../src/types/database.js';

const router = express.Router();

// GET /api/products - Get all products with optional filters
router.get('/', (req, res) => {
  const { category, search, featured, inStockOnly } = req.query;
  let products = db.getProducts();

  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  if (inStockOnly === 'true') {
    products = products.filter(p => p.stock > 0);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ products });
});

// GET /api/products/inventory/transactions - Admin view inventory logs
router.get('/inventory/transactions', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER']), (req, res) => {
  const transactions = db.getInventoryTransactions();
  res.json({ transactions });
});

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = db.getProductById(idOrSlug) || db.getProductBySlug(idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// POST /api/products - Create new product
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const {
      sku,
      name,
      category,
      categoryName,
      brand,
      description,
      images,
      specifications,
      price,
      discountPrice,
      stock,
      lowStockThreshold,
      warrantyMonths,
      featured
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: sku || `DI-PRD-${Date.now().toString().slice(-4)}`,
      name,
      slug,
      category: category || 'electrical',
      categoryName: categoryName || 'Electrical Equipment',
      brand: brand || 'DIGITAL INSTALL',
      description: description || '',
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'],
      specifications: specifications || {},
      price: Number(price) || 0,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      warrantyMonths: Number(warrantyMonths) || 12,
      featured: Boolean(featured),
      status: Number(stock) > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await db.createProduct(newProduct);

    if (newProduct.stock > 0) {
      await db.recordStockTransaction({
        id: `tx-${Date.now()}`,
        productId: created.id,
        productName: created.name,
        sku: created.sku,
        type: 'STOCK_IN',
        quantity: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: 'Initial Product Stock In',
        performedBy: req.user!.name,
        createdAt: new Date().toISOString()
      });
    }

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'PRODUCT_CREATED',
      entityType: 'PRODUCT',
      entityId: created.id,
      details: `Created product: ${created.name} (${created.sku}) with stock ${created.stock}`
    });

    res.status(201).json({ product: created });
  } catch (err: any) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      sku,
      category,
      categoryName,
      brand,
      description,
      images,
      specifications,
      price,
      discountPrice,
      lowStockThreshold,
      warrantyMonths,
      featured,
      status
    } = req.body;

    const updated = await db.updateProduct(product.id, {
      ...(name && { name }),
      ...(sku && { sku }),
      ...(category && { category }),
      ...(categoryName && { categoryName }),
      ...(brand && { brand }),
      ...(description !== undefined && { description }),
      ...(images && { images }),
      ...(specifications && { specifications }),
      ...(price !== undefined && { price: Number(price) }),
      ...(discountPrice !== undefined && { discountPrice: discountPrice ? Number(discountPrice) : undefined }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: Number(lowStockThreshold) }),
      ...(warrantyMonths !== undefined && { warrantyMonths: Number(warrantyMonths) }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(status && { status })
    });

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'PRODUCT_UPDATED',
      entityType: 'PRODUCT',
      entityId: product.id,
      details: `Updated product metadata: ${product.name}`
    });

    res.json({ product: updated });
  } catch (err: any) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// POST /api/products/:id/adjust-stock - Stock adjustment with transaction audit
router.post('/:id/adjust-stock', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'SHOP_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { type, quantity, reason, reference } = req.body;
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Valid positive quantity is required' });
    }

    const prevStock = product.stock;
    let newStock = prevStock;

    if (type === 'STOCK_IN' || type === 'RETURN') {
      newStock += qty;
    } else if (type === 'STOCK_OUT') {
      if (prevStock < qty) {
        return res.status(400).json({ error: `Insufficient stock. Current stock is ${prevStock}` });
      }
      newStock -= qty;
    } else if (type === 'ADJUSTMENT') {
      newStock = qty;
    }

    const newStatus = newStock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';

    await db.updateProduct(product.id, {
      stock: newStock,
      status: newStatus
    });

    const tx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: type || 'ADJUSTMENT',
      quantity: qty,
      previousStock: prevStock,
      newStock,
      reason: reason || 'Manual Stock Adjustment',
      reference,
      performedBy: req.user!.name,
      createdAt: new Date().toISOString()
    };

    await db.recordStockTransaction(tx);

    await db.addAuditLog({
      userId: req.user!.userId,
      userName: req.user!.name,
      userRole: req.user!.role,
      action: 'STOCK_ADJUSTED',
      entityType: 'PRODUCT',
      entityId: product.id,
      details: `${type} of ${qty} units for ${product.name} (${product.sku}). Stock: ${prevStock} -> ${newStock}`
    });

    res.json({ message: 'Stock adjusted successfully', currentStock: newStock, product: db.getProductById(product.id) });
  } catch (err: any) {
    console.error('Adjust stock error:', err);
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  const deleted = await db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
});

export default router;
