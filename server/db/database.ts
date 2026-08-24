import fs from 'fs';
import path from 'path';
import {
  User,
  CustomerProfile,
  StaffProfile,
  Service,
  Product,
  Quote,
  Project,
  Order,
  Warranty,
  WarrantyClaim,
  SupportTicket,
  CompanySettings,
  ContactMessage,
  AuditLog,
  Notification,
  InventoryTransaction
} from '../../src/types/database.js';
import { getSeedData } from './seeds.js';

interface DatabaseSchema {
  users: User[];
  customers: CustomerProfile[];
  staff: StaffProfile[];
  services: Service[];
  products: Product[];
  inventoryTransactions: InventoryTransaction[];
  projects: Project[];
  quotes: Quote[];
  orders: Order[];
  warranties: Warranty[];
  claims: WarrantyClaim[];
  tickets: SupportTicket[];
  contactMessages: ContactMessage[];
  settings: CompanySettings;
  auditLogs: AuditLog[];
  notifications: Notification[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'digital_install_db.json');

class DatabaseManager {
  private data: DatabaseSchema | null = null;
  private isSaving = false;
  private pendingSave = false;

  public async init(): Promise<void> {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('Database loaded successfully from persistent file.');
      } catch (err) {
        console.error('Failed to parse database file, resetting to seeds:', err);
        await this.resetToSeeds();
      }
    } else {
      console.log('No existing database found, initializing with seed data...');
      await this.resetToSeeds();
    }
  }

  public async resetToSeeds(): Promise<void> {
    const seed = await getSeedData();
    this.data = {
      ...seed,
      inventoryTransactions: []
    };
    await this.save();
    console.log('Database initialized with production seeds.');
  }

  private async save(): Promise<void> {
    if (!this.data) return;
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }

    this.isSaving = true;
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_FILE, serialized, 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    } finally {
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        await this.save();
      }
    }
  }

  private getDB(): DatabaseSchema {
    if (!this.data) {
      throw new Error('Database not initialized. Call db.init() first.');
    }
    return this.data;
  }

  // --- Users & Profiles ---
  public getUsers(): User[] {
    return this.getDB().users;
  }

  public getUserById(id: string): User | undefined {
    return this.getDB().users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async createUser(user: User): Promise<User> {
    this.getDB().users.push(user);
    await this.save();
    return user;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const idx = this.getDB().users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.getDB().users[idx] = {
      ...this.getDB().users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().users[idx];
  }

  public getStaffProfiles(): StaffProfile[] {
    return this.getDB().staff;
  }

  public getCustomerProfiles(): CustomerProfile[] {
    return this.getDB().customers;
  }

  public getCustomerProfileByUserId(userId: string): CustomerProfile | undefined {
    return this.getDB().customers.find(c => c.userId === userId);
  }

  public async saveCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile> {
    const idx = this.getDB().customers.findIndex(c => c.userId === profile.userId);
    if (idx >= 0) {
      this.getDB().customers[idx] = profile;
    } else {
      this.getDB().customers.push(profile);
    }
    await this.save();
    return profile;
  }

  // --- Services ---
  public getServices(): Service[] {
    return this.getDB().services;
  }

  public getServiceBySlug(slug: string): Service | undefined {
    return this.getDB().services.find(s => s.slug === slug);
  }

  public async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const idx = this.getDB().services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.getDB().services[idx] = { ...this.getDB().services[idx], ...updates };
    await this.save();
    return this.getDB().services[idx];
  }

  // --- Products & Inventory ---
  public getProducts(): Product[] {
    return this.getDB().products;
  }

  public getProductById(id: string): Product | undefined {
    return this.getDB().products.find(p => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.getDB().products.find(p => p.slug === slug);
  }

  public async createProduct(product: Product): Promise<Product> {
    this.getDB().products.push(product);
    await this.save();
    return product;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = this.getDB().products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.getDB().products[idx] = {
      ...this.getDB().products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().products[idx];
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const len = this.getDB().products.length;
    this.getDB().products = this.getDB().products.filter(p => p.id !== id);
    if (this.getDB().products.length !== len) {
      await this.save();
      return true;
    }
    return false;
  }

  public async recordStockTransaction(tx: InventoryTransaction): Promise<void> {
    this.getDB().inventoryTransactions.unshift(tx);
    await this.save();
  }

  public getInventoryTransactions(): InventoryTransaction[] {
    return this.getDB().inventoryTransactions;
  }

  // --- Quotes ---
  public getQuotes(): Quote[] {
    return this.getDB().quotes;
  }

  public getQuoteById(id: string): Quote | undefined {
    return this.getDB().quotes.find(q => q.id === id);
  }

  public getQuotesByCustomer(customerId: string): Quote[] {
    return this.getDB().quotes.filter(q => q.customerId === customerId);
  }

  public generateQuoteNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().quotes.length + 1;
    return `DI-QT-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createQuote(quote: Quote): Promise<Quote> {
    this.getDB().quotes.unshift(quote);
    await this.save();
    return quote;
  }

  public async updateQuote(id: string, updates: Partial<Quote>): Promise<Quote | null> {
    const idx = this.getDB().quotes.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.getDB().quotes[idx] = {
      ...this.getDB().quotes[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().quotes[idx];
  }

  // --- Projects ---
  public getProjects(): Project[] {
    return this.getDB().projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.getDB().projects.find(p => p.id === id);
  }

  public getProjectsByCustomer(customerId: string): Project[] {
    return this.getDB().projects.filter(p => p.customerId === customerId);
  }

  public getProjectsByTechnician(techUserId: string): Project[] {
    return this.getDB().projects.filter(p => p.assignedTechnicianIds.includes(techUserId));
  }

  public generateProjectNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().projects.length + 1;
    return `DI-PRJ-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createProject(project: Project): Promise<Project> {
    this.getDB().projects.unshift(project);
    await this.save();
    return project;
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const idx = this.getDB().projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.getDB().projects[idx] = {
      ...this.getDB().projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().projects[idx];
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.getDB().orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.getDB().orders.find(o => o.id === id);
  }

  public getOrdersByCustomer(customerId: string): Order[] {
    return this.getDB().orders.filter(o => o.customerId === customerId);
  }

  public generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().orders.length + 1;
    return `DI-ORD-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createOrder(order: Order): Promise<Order> {
    this.getDB().orders.unshift(order);
    await this.save();
    return order;
  }

  public async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const idx = this.getDB().orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.getDB().orders[idx] = {
      ...this.getDB().orders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().orders[idx];
  }

  // --- Warranties & Claims ---
  public getWarranties(): Warranty[] {
    return this.getDB().warranties;
  }

  public getWarrantyById(id: string): Warranty | undefined {
    return this.getDB().warranties.find(w => w.id === id);
  }

  public getWarrantyByNumber(warrantyNumber: string): Warranty | undefined {
    return this.getDB().warranties.find(w => w.warrantyNumber.toUpperCase() === warrantyNumber.toUpperCase().trim());
  }

  public getWarrantyBySerial(serial: string): Warranty | undefined {
    return this.getDB().warranties.find(w => w.serialNumber.toUpperCase() === serial.toUpperCase().trim());
  }

  public getWarrantiesByCustomer(customerId: string): Warranty[] {
    return this.getDB().warranties.filter(w => w.customerId === customerId);
  }

  public generateWarrantyNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().warranties.length + 1;
    return `DI-WR-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createWarranty(warranty: Warranty): Promise<Warranty> {
    this.getDB().warranties.unshift(warranty);
    await this.save();
    return warranty;
  }

  public async updateWarranty(id: string, updates: Partial<Warranty>): Promise<Warranty | null> {
    const idx = this.getDB().warranties.findIndex(w => w.id === id);
    if (idx === -1) return null;
    this.getDB().warranties[idx] = { ...this.getDB().warranties[idx], ...updates };
    await this.save();
    return this.getDB().warranties[idx];
  }

  public getWarrantyClaims(): WarrantyClaim[] {
    return this.getDB().claims;
  }

  public generateClaimNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().claims.length + 1;
    return `DI-CLM-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createWarrantyClaim(claim: WarrantyClaim): Promise<WarrantyClaim> {
    this.getDB().claims.unshift(claim);
    // increment claim counter on warranty
    const w = this.getWarrantyById(claim.warrantyId);
    if (w) {
      await this.updateWarranty(w.id, { claimsCount: (w.claimsCount || 0) + 1, status: 'CLAIMED' });
    }
    await this.save();
    return claim;
  }

  public async updateWarrantyClaim(id: string, updates: Partial<WarrantyClaim>): Promise<WarrantyClaim | null> {
    const idx = this.getDB().claims.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.getDB().claims[idx] = { ...this.getDB().claims[idx], ...updates };
    await this.save();
    return this.getDB().claims[idx];
  }

  // --- Support Tickets & Messages ---
  public getTickets(): SupportTicket[] {
    return this.getDB().tickets;
  }

  public getTicketById(id: string): SupportTicket | undefined {
    return this.getDB().tickets.find(t => t.id === id);
  }

  public getTicketsByCustomer(customerId: string): SupportTicket[] {
    return this.getDB().tickets.filter(t => t.customerId === customerId);
  }

  public getTicketsByTechnician(techUserId: string): SupportTicket[] {
    return this.getDB().tickets.filter(t => t.assignedStaffId === techUserId);
  }

  public generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const count = this.getDB().tickets.length + 1;
    return `DI-TK-${year}-${String(count).padStart(5, '0')}`;
  }

  public async createTicket(ticket: SupportTicket): Promise<SupportTicket> {
    this.getDB().tickets.unshift(ticket);
    await this.save();
    return ticket;
  }

  public async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const idx = this.getDB().tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.getDB().tickets[idx] = {
      ...this.getDB().tickets[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.getDB().tickets[idx];
  }

  public async addTicketMessage(ticketId: string, message: any): Promise<SupportTicket | null> {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return null;
    ticket.messages.push(message);
    ticket.updatedAt = new Date().toISOString();
    await this.save();
    return ticket;
  }

  // --- Contact Messages ---
  public getContactMessages(): ContactMessage[] {
    return this.getDB().contactMessages;
  }

  public async createContactMessage(msg: ContactMessage): Promise<ContactMessage> {
    this.getDB().contactMessages.unshift(msg);
    await this.save();
    return msg;
  }

  public async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> {
    const idx = this.getDB().contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.getDB().contactMessages[idx] = { ...this.getDB().contactMessages[idx], ...updates };
    await this.save();
    return this.getDB().contactMessages[idx];
  }

  // --- Settings ---
  public getSettings(): CompanySettings {
    return this.getDB().settings;
  }

  public async updateSettings(updates: Partial<CompanySettings>): Promise<CompanySettings> {
    this.getDB().settings = { ...this.getDB().settings, ...updates };
    await this.save();
    return this.getDB().settings;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.getDB().auditLogs;
  }

  public async addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.getDB().auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (this.getDB().auditLogs.length > 200) {
      this.getDB().auditLogs = this.getDB().auditLogs.slice(0, 200);
    }
    await this.save();
    return newLog;
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    return this.getDB().notifications.filter(n => n.userId === userId || n.userId === 'ALL_ADMINS');
  }

  public async addNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
    const item: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.getDB().notifications.unshift(item);
    await this.save();
    return item;
  }

  public async markNotificationRead(id: string): Promise<void> {
    const notif = this.getDB().notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      await this.save();
    }
  }
}

export const db = new DatabaseManager();
