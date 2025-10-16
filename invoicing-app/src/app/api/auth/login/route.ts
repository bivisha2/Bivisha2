import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/services/authService';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Use authService to login user
        const result = await loginUser({ email, password });

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            user: result.user
        });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}