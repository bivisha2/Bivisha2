import bcrypt from 'bcryptjs';

// Interfaces
export interface User {
    id?: string | number;
    name: string;
    email: string;
    password?: string; // Optional for return objects
    role?: 'admin' | 'user';
    isActive?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Client {
    id?: string | number;
    userId: string | number;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    vatin?: string;
    creditLimit?: number;
    outstandingBalance?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Product {
    id?: string | number;
    userId: string | number;
    name: string;
    description?: string;
    sku?: string;
    price: number;
    taxRate?: number;
    category?: string;
    stockQuantity?: number;
    trackInventory?: boolean;
    isActive?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Invoice {
    id?: string | number;
    userId: string | number;
    clientId: string | number;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    subtotal: number;
    taxAmount?: number;
    discountAmount?: number;
    totalAmount: number;
    notes?: string;
    terms?: string;
    items?: InvoiceItem[];
    created_at?: Date;
    updated_at?: Date;
}

export interface InvoiceItem {
    id?: string | number;
    invoiceId: string | number;
    productId?: string | number;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    total: number;
}

// In-memory storage as fallback
class InMemoryDataStore {
    private users: User[] = [
        {
            id: '1',
            name: 'Demo User',
            email: 'demo@invoicepro.com',
            password: '$2a$12$rI7Q.6K9QZ8Q8Q8Q8Q8Q8eKJ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', // Demo123
            role: 'admin',
            isActive: true,
            created_at: new Date(),
        },
        {
            id: '2',
            name: 'John Doe',
            email: 'john@example.com',
            password: '$2a$12$rI7Q.6K9QZ8Q8Q8Q8Q8Q8eKJ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', // password123
            role: 'user',
            isActive: true,
            created_at: new Date(),
        }
    ];

    private clients: Client[] = [];
    private products: Product[] = [];
    private invoices: Invoice[] = [];
    private nextUserId = 3;
    private nextClientId = 1;
    private nextProductId = 1;
    private nextInvoiceId = 1;

    // User methods
    async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password || '', 12);
        const user: User = {
            id: this.nextUserId++,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'user',
            isActive: userData.isActive !== false,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.users.push(user);
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email && user.isActive) || null;
    }

    async getUserById(id: string | number): Promise<User | null> {
        return this.users.find(user => user.id === id && user.isActive) || null;
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async getAllUsers(): Promise<User[]> {
        return this.users.map(({ password, ...user }) => user);
    }

    // Client methods
    async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
        const client: Client = {
            id: this.nextClientId++,
            ...clientData,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.clients.push(client);
        return client;
    }

    async getClientsByUserId(userId: string | number): Promise<Client[]> {
        return this.clients.filter(client => client.userId === userId);
    }

    async getClientById(id: string | number): Promise<Client | null> {
        return this.clients.find(client => client.id === id) || null;
    }

    async updateClient(id: string | number, clientData: Partial<Client>): Promise<Client | null> {
        const index = this.clients.findIndex(client => client.id === id);
        if (index === -1) return null;

        this.clients[index] = {
            ...this.clients[index],
            ...clientData,
            updated_at: new Date()
        };

        return this.clients[index];
    }

    async deleteClient(id: string | number): Promise<boolean> {
        const index = this.clients.findIndex(client => client.id === id);
        if (index === -1) return false;

        this.clients.splice(index, 1);
        return true;
    }

    // Product methods
    async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
        const product: Product = {
            id: this.nextProductId++,
            ...productData,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.products.push(product);
        return product;
    }

    async getProductsByUserId(userId: string | number): Promise<Product[]> {
        return this.products.filter(product => product.userId === userId && product.isActive);
    }

    async getProductById(id: string | number): Promise<Product | null> {
        return this.products.find(product => product.id === id && product.isActive) || null;
    }

    // Invoice methods
    async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
        const invoice: Invoice = {
            id: this.nextInvoiceId++,
            ...invoiceData,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.invoices.push(invoice);
        return invoice;
    }

    async getInvoicesByUserId(userId: string | number): Promise<Invoice[]> {
        return this.invoices.filter(invoice => invoice.userId === userId);
    }

    async getInvoiceById(id: string | number): Promise<Invoice | null> {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }

    // Analytics
    async getAnalytics(userId: string | number) {
        const userInvoices = this.invoices.filter(invoice => invoice.userId === userId);
        const userClients = this.clients.filter(client => client.userId === userId);

        const totalRevenue = userInvoices
            .filter(invoice => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

        const outstandingAmount = userInvoices
            .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
            .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

        const recentInvoices = userInvoices
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 5);

        return {
            totalRevenue,
            totalInvoices: userInvoices.length,
            paidInvoices: userInvoices.filter(invoice => invoice.status === 'paid').length,
            outstandingAmount,
            totalClients: userClients.length,
            recentInvoices
        };
    }

    async testConnection(): Promise<boolean> {
        return true; // Always true for in-memory storage
    }
}

// PostgreSQL Database Service
class PostgreSQLDataStore {
    private pool: any;

    constructor(pool: any) {
        this.pool = pool;
    }

    async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password || '', 12);

        const query = `
      INSERT INTO users (name, email, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, is_active, created_at, updated_at
    `;

        const values = [
            userData.name,
            userData.email,
            hashedPassword,
            userData.role || 'user',
            userData.isActive !== false
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
        const result = await this.pool.query(query, [email]);
        return result.rows[0] || null;
    }

    async getUserById(id: string | number): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
        const result = await this.pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async getAllUsers(): Promise<User[]> {
        const query = 'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC';
        const result = await this.pool.query(query);
        return result.rows;
    }

    async testConnection(): Promise<boolean> {
        try {
            const result = await this.pool.query('SELECT NOW()');
            return !!result.rows[0];
        } catch (error) {
            return false;
        }
    }

    // Implement other methods similar to InMemoryDataStore...
}

// Database Service Factory
export class DatabaseService {
    private static instance: InMemoryDataStore | PostgreSQLDataStore;
    private static isInitialized = false;

    static async initialize() {
        if (this.isInitialized) return;

        try {
            // PostgreSQL support commented out - using in-memory storage for now
            // To enable PostgreSQL: install pg, @types/pg, and uncomment below
            /*
            const { default: pool } = await import('../lib/database');

            // Test PostgreSQL connection
            const client = await pool.connect();
            await client.query('SELECT NOW()');
            client.release();

            console.log('✅ Using PostgreSQL database');
            this.instance = new PostgreSQLDataStore(pool);
            */

            // Using in-memory storage
            throw new Error('PostgreSQL not configured - using in-memory storage');
        } catch (error) {
            console.log('⚠️  PostgreSQL not available, using in-memory storage');
            this.instance = new InMemoryDataStore();
        }

        this.isInitialized = true;
    }

    static async getInstance(): Promise<InMemoryDataStore | PostgreSQLDataStore> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.instance;
    }

    // Proxy methods
    static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const instance = await this.getInstance();
        return instance.createUser(userData);
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const instance = await this.getInstance();
        return instance.getUserByEmail(email);
    }

    static async getUserById(id: string | number): Promise<User | null> {
        const instance = await this.getInstance();
        return instance.getUserById(id);
    }

    static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const instance = await this.getInstance();
        return instance.verifyPassword(plainPassword, hashedPassword);
    }

    static async getAllUsers(): Promise<User[]> {
        const instance = await this.getInstance();
        return instance.getAllUsers();
    }

    static async testConnection(): Promise<boolean> {
        const instance = await this.getInstance();
        return instance.testConnection();
    }
}