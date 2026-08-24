// Digital Install - Core TypeScript Data Types & Models

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'SHOP_MANAGER' | 'TECHNICIAN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  address?: string;
  city?: string;
  subCity?: string;
  tinNumber?: string;
  totalSpent: number;
  notes?: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  jobTitle: string;
  department: 'ENGINEERING' | 'SECURITY' | 'NETWORKING' | 'IT' | 'SALES' | 'MANAGEMENT';
  specialization?: string;
  activeProjectsCount: number;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  features: string[];
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  subServices: string[];
  faqs: { question: string; answer: string }[];
  estimatedStartingPrice?: number;
  popular?: boolean;
}

export type QuoteStatus = 'NEW' | 'REVIEWING' | 'SITE_VISIT' | 'QUOTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface QuoteItem {
  id: string;
  description: string;
  serviceId?: string;
  type: 'MATERIAL' | 'LABOR' | 'SERVICE' | 'EQUIPMENT';
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g. DI-QT-2026-00001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL';
  requiredServices: string[]; // slugs or names
  projectDescription: string;
  estimatedBudget?: string;
  preferredDate?: string;
  attachments?: string[];
  customerNotes?: string;
  status: QuoteStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.15 for 15% VAT
  taxAmount: number;
  discount: number;
  totalAmount: number;
  adminNotes?: string;
  validUntil?: string;
  approvedAt?: string;
  rejectedReason?: string;
  convertedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'MATERIALS' | 'INSTALLATION' | 'TESTING' | 'COMMISSIONING' | 'COMPLETED' | 'MAINTENANCE';

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

export interface Project {
  id: string;
  projectNumber: string; // e.g. DI-PRJ-2026-00001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  quoteId?: string;
  title: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL';
  location: string;
  description: string;
  scopeOfWork: string[];
  budget: number;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  assignedTechnicianIds: string[];
  assignedTechnicianNames: string[];
  status: ProjectStatus;
  progressPercentage: number;
  milestones: ProjectMilestone[];
  photos: { url: string; caption: string; date: string; stage: string }[];
  documents: { name: string; url: string; size: string; date: string }[];
  isFeatured?: boolean;
  featuredImage?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  sku: string; // e.g. DI-PROD-CCTV-01
  name: string;
  slug: string;
  category: 'electrical' | 'security' | 'networking' | 'it';
  categoryName: string;
  brand: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  price: number; // in ETB
  discountPrice?: number;
  stock: number;
  lowStockThreshold: number;
  warrantyMonths: number;
  featured?: boolean;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy: string;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. DI-ORD-2026-00001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  subCity?: string;
  orderType: 'PURCHASE' | 'QUOTE_REQUEST';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'TELEBIRR' | 'CBE_BIRR' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'INVOICE_QUOTE';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'NOT_APPLICABLE';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type WarrantyStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'CLAIMED';

export interface Warranty {
  id: string;
  warrantyNumber: string; // e.g. DI-WR-2026-00001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  projectId?: string;
  projectName?: string;
  productId?: string;
  productName?: string;
  serialNumber: string;
  installationDate: string;
  startDate: string;
  endDate: string;
  warrantyType: 'EQUIPMENT_WARRANTY' | 'INSTALLATION_WARRANTY' | 'COMPREHENSIVE';
  coverageDetails: string;
  status: WarrantyStatus;
  claimsCount: number;
  createdAt: string;
}

export interface WarrantyClaim {
  id: string;
  claimNumber: string; // e.g. DI-CLM-2026-00001
  warrantyId: string;
  warrantyNumber: string;
  customerId: string;
  customerName: string;
  issueDescription: string;
  attachments?: string[];
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'INSPECTION_SCHEDULED' | 'APPROVED' | 'REPLACED' | 'REJECTED';
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 'Electrical' | 'CCTV' | 'Network' | 'Wi-Fi' | 'Computer' | 'Software' | 'Warranty' | 'Other';

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. DI-TK-2026-00001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  initialMessage: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface MaintenanceContract {
  id: string;
  contractNumber: string; // e.g. DI-MNT-2026-00001
  customerId: string;
  customerName: string;
  propertyAddress: string;
  serviceType: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL' | 'ANNUAL';
  lastVisitDate?: string;
  nextScheduledVisit: string;
  status: 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'TERMINATED';
  technicianInCharge: string;
  annualFee: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
  status: 'NEW' | 'READ' | 'CONTACTED' | 'CONVERTED_TO_QUOTE';
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  slogan: string;
  logoUrl: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsApp: string;
  email: string;
  supportEmail: string;
  address: string;
  city: string;
  country: string;
  businessHours: string;
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number; // 0.15 = 15% VAT
  defaultWarrantyDays: number;
  tinNumber: string;
  licenseNumber: string;
  socials: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'QUOTE' | 'PROJECT' | 'ORDER' | 'PRODUCT' | 'WARRANTY' | 'TICKET' | 'SETTINGS' | 'AUTH';
  entityId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // or 'ALL_ADMINS'
  title: string;
  message: string;
  link?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}
