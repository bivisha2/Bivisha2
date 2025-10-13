import bcrypt from 'bcryptjs';
import { query } from './database';

// Password hashing configuration
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

// User interface for database operations
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
}

export interface UserSession {
  id: number;
  userId: number;
  sessionToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  sessionToken?: string;
}

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Session token generation
const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// User registration
export const registerUser = async (userData: CreateUserData, ipAddress?: string, userAgent?: string): Promise<AuthResult> => {
  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return {
        success: false,
        message: 'User with this email already exists'
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create the user
    const userResult = await query(`
      INSERT INTO users (name, email, password_hash, role, is_active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, email, role, is_active, created_at, updated_at, email_verified
    `, [
      userData.name.trim(),
      userData.email.toLowerCase(),
      hashedPassword,
      userData.role || 'user',
      true,
      false
    ]);

    const newUser = userResult.rows[0];

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, created_at, ip_address, user_agent)
      VALUES ($1, $2, $3, NOW(), $4, $5)
    `, [newUser.id, sessionToken, expiresAt, ipAddress, userAgent]);

    // Log the registration
    await query(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      newUser.id,
      'USER_REGISTERED',
      'user',
      newUser.id,
      JSON.stringify({ email: newUser.email, name: newUser.name }),
      ipAddress,
      userAgent
    ]);

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.is_active,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at,
        emailVerified: newUser.email_verified
      },
      sessionToken
    };

  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

// User login
export const loginUser = async (credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResult> => {
  try {
    // Find user by email
    const userResult = await query(
      'SELECT id, name, email, password_hash, role, is_active, email_verified FROM users WHERE email = $1',
      [credentials.email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        message: 'Account is disabled. Please contact support.'
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, user.password_hash);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, created_at, ip_address, user_agent)
      VALUES ($1, $2, $3, NOW(), $4, $5)
    `, [user.id, sessionToken, expiresAt, ipAddress, userAgent]);

    // Log the login
    await query(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [user.id, 'USER_LOGIN', 'user', user.id, ipAddress, userAgent]);

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        emailVerified: user.email_verified
      },
      sessionToken
    };

  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.'
    };
  }
};

// Validate session
export const validateSession = async (sessionToken: string): Promise<User | null> => {
  try {
    const sessionResult = await query(`
      SELECT 
        us.user_id, us.expires_at,
        u.id, u.name, u.email, u.role, u.is_active, u.created_at, u.updated_at, u.last_login, u.email_verified
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.session_token = $1 AND us.expires_at > NOW() AND u.is_active = true
    `, [sessionToken]);

    if (sessionResult.rows.length === 0) {
      return null;
    }

    const session = sessionResult.rows[0];

    return {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      isActive: session.is_active,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      lastLogin: session.last_login,
      emailVerified: session.email_verified
    };

  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
};

// Logout user (invalidate session)
export const logoutUser = async (sessionToken: string, ipAddress?: string, userAgent?: string): Promise<boolean> => {
  try {
    // Get user ID from session before deleting
    const sessionResult = await query(
      'SELECT user_id FROM user_sessions WHERE session_token = $1',
      [sessionToken]
    );

    // Delete the session
    const result = await query(
      'DELETE FROM user_sessions WHERE session_token = $1',
      [sessionToken]
    );

    // Log the logout if we found the session
    if (sessionResult.rows.length > 0) {
      const userId = sessionResult.rows[0].user_id;
      await query(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [userId, 'USER_LOGOUT', 'user', userId, ipAddress, userAgent]);
    }

    return (result.rowCount || 0) > 0;

  } catch (error) {
    console.error('Error logging out user:', error);
    return false;
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const result = await query(`
      SELECT id, name, email, role, is_active, created_at, updated_at, last_login, email_verified
      FROM users 
      WHERE id = $1 AND is_active = true
    `, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
      emailVerified: user.email_verified
    };

  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Update user password
export const updateUserPassword = async (userId: number, newPassword: string): Promise<boolean> => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const result = await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Log password change
    await query(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [userId, 'PASSWORD_CHANGED', 'user', userId]);

    return (result.rowCount || 0) > 0;

  } catch (error) {
    console.error('Error updating user password:', error);
    return false;
  }
};

// Delete expired sessions (cleanup function)
export const cleanupExpiredSessions = async (): Promise<number> => {
  try {
    const result = await query('DELETE FROM user_sessions WHERE expires_at < NOW()');
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
};

// Get active sessions for a user
export const getUserSessions = async (userId: number): Promise<UserSession[]> => {
  try {
    const result = await query(`
      SELECT id, user_id, session_token, expires_at, created_at, ip_address, user_agent
      FROM user_sessions 
      WHERE user_id = $1 AND expires_at > NOW()
      ORDER BY created_at DESC
    `, [userId]);

    return result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      sessionToken: row.session_token,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      ipAddress: row.ip_address,
      userAgent: row.user_agent
    }));

  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
};