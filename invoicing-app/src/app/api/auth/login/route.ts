import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../services/database';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await DatabaseService.getUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await DatabaseService.verifyPassword(password, user.password || '');

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Remove password from user object before sending
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}