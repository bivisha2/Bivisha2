import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/authService';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, phone, company } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Use authService to register user
        const result = await registerUser({
            name,
            email,
            password,
            phone,
            company
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: result.message.includes('already') ? 409 : 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            user: result.user
        });

    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}