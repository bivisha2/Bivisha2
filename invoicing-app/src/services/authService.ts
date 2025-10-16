import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserSession {
    id: string;
    email: string;
    name: string;
    company?: string;
    role: string;
}

// Register new user
export async function registerUser(data: RegisterData): Promise<{ success: boolean; message: string; user?: UserSession }> {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                company: data.company,
                role: 'user'
            }
        });

        // Return user session (without password)
        const userSession: UserSession = {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company || undefined,
            role: user.role
        };

        return {
            success: true,
            message: 'Account created successfully',
            user: userSession
        };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Failed to create account' };
    }
}

// Login user
export async function loginUser(data: LoginData): Promise<{ success: boolean; message: string; user?: UserSession }> {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Create session token
        const sessionToken = generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await prisma.session.create({
            data: {
                userId: user.id,
                token: sessionToken,
                expiresAt
            }
        });

        // Return user session
        const userSession: UserSession = {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company || undefined,
            role: user.role
        };

        // Store session token in localStorage (client-side)
        if (typeof window !== 'undefined') {
            localStorage.setItem('sessionToken', sessionToken);
        }

        return {
            success: true,
            message: 'Login successful',
            user: userSession
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed' };
    }
}

// Verify session
export async function verifySession(token: string): Promise<UserSession | null> {
    try {
        const session = await prisma.session.findUnique({
            where: { token }
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        // Get user separately
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                company: true,
                role: true
            }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company || undefined,
            role: user.role
        };
    } catch (error) {
        console.error('Session verification error:', error);
        return null;
    }
}

// Logout user
export async function logoutUser(token: string): Promise<boolean> {
    try {
        await prisma.session.delete({
            where: { token }
        });

        if (typeof window !== 'undefined') {
            localStorage.removeItem('sessionToken');
        }

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}

// Get current user from token
export async function getCurrentUser(token: string): Promise<UserSession | null> {
    return verifySession(token);
}

// Helper function to generate session token
function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Clean expired sessions (run periodically)
export async function cleanExpiredSessions(): Promise<void> {
    try {
        await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    } catch (error) {
        console.error('Error cleaning sessions:', error);
    }
}
