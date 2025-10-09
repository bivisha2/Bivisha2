// Server-side data storage simulation
// In a real app, this would be replaced with a proper database

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address: string;
  vatNumber?: string;
  creditLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  taxRate: number;
  category?: string;
  inStock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  recurring?: RecurringSettings;
  paymentHistory: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'bank' | 'stripe' | 'paypal' | 'esewa' | 'khalti';
  reference?: string;
  notes?: string;
}

export interface RecurringSettings {
  enabled: boolean;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  endDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed
  role: 'admin' | 'accountant' | 'viewer';
  isActive: boolean;
  lastLogin?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  token: string;
  expiresAt: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  vatNumber: string;
  registrationNumber?: string;
  bankDetails?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logoPosition: 'left' | 'center' | 'right';
  };
}

// Server-side storage (simulated)
class DataStore {
  private clients: Client[] = [];
  private products: Product[] = [];
  private invoices: Invoice[] = [];
  private users: User[] = [];
  private companySettings: CompanySettings | null = null;
  private auditLog: AuditLogEntry[] = [];
  private activeSessions: Map<string, AuthSession> = new Map();

  // Client Management
  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const newClient: Client = {
      ...client,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clients.push(newClient);
    this.logAction('create_client', newClient.id, `Created client: ${newClient.name}`);
    return newClient;
  }

  updateClient(id: string, updates: Partial<Client>): Client | null {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.clients[index] = {
      ...this.clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction('update_client', id, `Updated client: ${this.clients[index].name}`);
    return this.clients[index];
  }

  deleteClient(id: string): boolean {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;

    const client = this.clients[index];
    this.clients.splice(index, 1);
    this.logAction('delete_client', id, `Deleted client: ${client.name}`);
    return true;
  }

  getClient(id: string): Client | null {
    return this.clients.find(c => c.id === id) || null;
  }

  getAllClients(): Client[] {
    return [...this.clients];
  }

  searchClients(query: string): Client[] {
    const lowercaseQuery = query.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      (client.company && client.company.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Product Management
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.push(newProduct);
    this.logAction('create_product', newProduct.id, `Created product: ${newProduct.name}`);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction('update_product', id, `Updated product: ${this.products[index].name}`);
    return this.products[index];
  }

  getAllProducts(): Product[] {
    return [...this.products];
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      (product.sku && product.sku.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Invoice Management
  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
    const newInvoice: Invoice = {
      ...invoice,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.push(newInvoice);
    this.logAction('create_invoice', newInvoice.id, `Created invoice: ${newInvoice.invoiceNumber}`);
    return newInvoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index === -1) return null;

    this.invoices[index] = {
      ...this.invoices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction('update_invoice', id, `Updated invoice: ${this.invoices[index].invoiceNumber}`);
    return this.invoices[index];
  }

  getAllInvoices(): Invoice[] {
    return [...this.invoices];
  }

  getInvoicesByClient(clientId: string): Invoice[] {
    return this.invoices.filter(invoice => invoice.clientId === clientId);
  }

  getInvoicesByStatus(status: Invoice['status']): Invoice[] {
    return this.invoices.filter(invoice => invoice.status === status);
  }

  // Payment Management
  addPayment(invoiceId: string, payment: Omit<PaymentRecord, 'id'>): Invoice | null {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (!invoice) return null;

    const newPayment: PaymentRecord = {
      ...payment,
      id: this.generateId(),
    };

    invoice.paymentHistory.push(newPayment);

    // Update invoice status based on payments
    const totalPaid = invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= invoice.total) {
      invoice.status = 'paid';
    } else if (totalPaid > 0) {
      // Partial payment - keep current status but could add 'partial' status
    }

    invoice.updatedAt = new Date().toISOString();
    this.logAction('add_payment', invoiceId, `Added payment of ${payment.amount} to invoice ${invoice.invoiceNumber}`);
    return invoice;
  }

  // Analytics
  getAnalytics(): Analytics {
    const totalRevenue = this.invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0);

    const pendingAmount = this.invoices
      .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
      .reduce((sum, i) => sum + i.total, 0);

    const overdueInvoices = this.invoices.filter(i =>
      i.status !== 'paid' && new Date(i.dueDate) < new Date()
    );

    const topClients = this.getTopClients(5);

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount: overdueInvoices.reduce((sum, i) => sum + i.total, 0),
      totalInvoices: this.invoices.length,
      paidInvoices: this.invoices.filter(i => i.status === 'paid').length,
      pendingInvoices: this.invoices.filter(i => i.status === 'sent').length,
      overdueInvoices: overdueInvoices.length,
      topClients,
      monthlyRevenue: this.getMonthlyRevenue(),
    };
  }

  private getTopClients(limit: number): Array<{ client: Client, totalRevenue: number, invoiceCount: number }> {
    const clientStats = new Map<string, { totalRevenue: number, invoiceCount: number }>();

    this.invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        const current = clientStats.get(invoice.clientId) || { totalRevenue: 0, invoiceCount: 0 };
        clientStats.set(invoice.clientId, {
          totalRevenue: current.totalRevenue + invoice.total,
          invoiceCount: current.invoiceCount + 1,
        });
      }
    });

    return Array.from(clientStats.entries())
      .map(([clientId, stats]) => ({
        client: this.getClient(clientId)!,
        ...stats,
      }))
      .filter(item => item.client)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  private getMonthlyRevenue(): Array<{ month: string, revenue: number }> {
    const monthlyData = new Map<string, number>();

    this.invoices
      .filter(i => i.status === 'paid')
      .forEach(invoice => {
        const month = new Date(invoice.issueDate).toISOString().slice(0, 7); // YYYY-MM
        const current = monthlyData.get(month) || 0;
        monthlyData.set(month, current + invoice.total);
      });

    return Array.from(monthlyData.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // Audit Log
  private logAction(action: string, entityId: string, description: string, userId?: string): void {
    this.auditLog.push({
      id: this.generateId(),
      action,
      entityId,
      description,
      userId: userId || 'system',
      timestamp: new Date().toISOString(),
    });
  }

  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Company Settings
  updateCompanySettings(settings: CompanySettings): void {
    this.companySettings = settings;
    this.logAction('update_settings', 'company', 'Updated company settings');
  }

  getCompanySettings(): CompanySettings | null {
    return this.companySettings;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export/Import functionality
  exportData(): { clients: Client[], products: Product[], invoices: Invoice[] } {
    return {
      clients: this.getAllClients(),
      products: this.getAllProducts(),
      invoices: this.getAllInvoices(),
    };
  }

  importData(data: { clients?: Client[], products?: Product[], invoices?: Invoice[] }): void {
    if (data.clients) {
      this.clients = [...this.clients, ...data.clients];
    }
    if (data.products) {
      this.products = [...this.products, ...data.products];
    }
    if (data.invoices) {
      this.invoices = [...this.invoices, ...data.invoices];
    }
    this.logAction('import_data', 'bulk', 'Imported data from external source');
  }

  // Authentication Methods
  registerUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: 'admin' | 'accountant' | 'viewer';
  }): { success: boolean; message: string; user?: User } {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Validate password strength
    if (userData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    const newUser: User = {
      id: this.generateId(),
      email: userData.email.toLowerCase(),
      name: userData.name,
      password: userData.password, // In production, hash this
      role: userData.role || 'viewer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.logAction('register_user', newUser.id, `User registered: ${newUser.email}`);

    return {
      success: true,
      message: 'User registered successfully',
      user: { ...newUser, password: '' } // Don't return password
    };
  }

  loginUser(email: string, password: string): { success: boolean; message: string; session?: AuthSession } {
    const user = this.users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.isActive
    );

    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    // Create session
    const token = this.generateToken();
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    this.activeSessions.set(token, session);
    this.logAction('login', user.id, `User logged in: ${user.email}`);

    return { success: true, message: 'Login successful', session };
  }

  logoutUser(token: string): { success: boolean; message: string } {
    const session = this.activeSessions.get(token);
    if (!session) {
      return { success: false, message: 'Invalid session' };
    }

    this.activeSessions.delete(token);
    this.logAction('logout', session.userId, `User logged out: ${session.email}`);

    return { success: true, message: 'Logged out successfully' };
  }

  validateSession(token: string): { valid: boolean; session?: AuthSession } {
    const session = this.activeSessions.get(token);
    if (!session) {
      return { valid: false };
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.activeSessions.delete(token);
      return { valid: false };
    }

    return { valid: true, session };
  }

  getAllUsers(): User[] {
    return this.users.map(user => ({ ...user, password: '' })); // Don't expose passwords
  }

  updateUserRole(userId: string, role: 'admin' | 'accountant' | 'viewer'): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.role = role;
    user.updatedAt = new Date().toISOString();
    this.logAction('update_user_role', userId, `User role updated to: ${role}`);
    return true;
  }

  deactivateUser(userId: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.isActive = false;
    user.updatedAt = new Date().toISOString();
    this.logAction('deactivate_user', userId, `User deactivated: ${user.email}`);

    // Remove all active sessions for this user
    for (const [token, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        this.activeSessions.delete(token);
      }
    }

    return true;
  }

  private generateToken(): string {
    return 'token_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Initialize with sample data
  initializeSampleData(): void {
    // Add sample admin user
    this.users.push({
      id: 'user_admin_001',
      email: 'admin@invoicepro.com',
      name: 'Admin User',
      password: 'admin123', // In production, this would be hashed
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add sample accountant user
    this.users.push({
      id: 'user_acc_001',
      email: 'accountant@invoicepro.com',
      name: 'John Accountant',
      password: 'acc123',
      role: 'accountant',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add sample clients
    const sampleClient = this.createClient({
      name: 'Acme Corporation',
      company: 'Acme Corp Ltd.',
      email: 'billing@acme.com',
      phone: '+1-555-0123',
      address: '123 Business Street, New York, NY 10001',
      vatNumber: 'VAT123456789',
      creditLimit: 50000,
    });

    // Add sample products
    const webDevProduct = this.createProduct({
      name: 'Web Development',
      description: 'Custom website development services',
      price: 100,
      sku: 'WEB-DEV-001',
      taxRate: 13,
      category: 'Services',
    });

    // Add sample invoice
    this.createInvoice({
      invoiceNumber: 'INV-001',
      clientId: sampleClient.id,
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{
        id: this.generateId(),
        productId: webDevProduct.id,
        description: 'Custom website development',
        quantity: 1,
        unitPrice: 2500,
        taxRate: 13,
        discountRate: 0,
        total: 2500,
      }],
      subtotal: 2500,
      taxAmount: 325,
      discountAmount: 0,
      total: 2825,
      paymentHistory: [],
    });
  }
}

export interface Analytics {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  topClients: Array<{ client: Client, totalRevenue: number, invoiceCount: number }>;
  monthlyRevenue: Array<{ month: string, revenue: number }>;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityId: string;
  description: string;
  userId: string;
  timestamp: string;
}

// Singleton instance
export const dataStore = new DataStore();

// Initialize with sample data
dataStore.initializeSampleData();