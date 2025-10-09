import { Pool, PoolConfig } from 'pg';

// Database configuration
const config: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'invoicepro_db',
  user: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create a new pool instance
let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  // In production, use DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // In development, use individual config values
  pool = new Pool(config);
}

// Database query helper function with error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a client from the pool for transactions
export const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error getting database client:', error);
    throw error;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT false,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP
      )
    `);

    // Create user sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address INET,
        user_agent TEXT
      )
    `);

    // Create clients table
    await query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        tax_number VARCHAR(100),
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sku VARCHAR(100) UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2),
        category VARCHAR(100),
        unit VARCHAR(50) DEFAULT 'pcs',
        stock_quantity INTEGER DEFAULT 0,
        minimum_stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    await query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INTEGER REFERENCES clients(id),
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes TEXT,
        terms TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      )
    `);

    // Create invoice items table
    await query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        description TEXT NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create audit log table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`);

    console.log('Database tables initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Clean up expired sessions
export const cleanupExpiredSessions = async () => {
  try {
    const result = await query(`
      DELETE FROM user_sessions 
      WHERE expires_at < NOW()
    `);
    console.log(`Cleaned up ${result.rowCount} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
};

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeDatabaseConnection = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

export default pool;