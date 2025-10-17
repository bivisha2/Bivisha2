import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Get user (in production, get from authenticated session)
        const users = await prisma.user.findMany();
        
        if (users.length === 0) {
            return NextResponse.json({
                invoices: [],
                clients: []
            });
        }

        const userId = users[0].id;

        // Get recent invoices (last 5)
        const recentInvoices = await prisma.invoice.findMany({
            where: { userId },
            include: {
                client: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        // Get recent clients (last 5)
        const recentClients = await prisma.client.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        return NextResponse.json({
            invoices: recentInvoices,
            clients: recentClients
        });

    } catch (error) {
        console.error('Recent activity error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recent activity' },
            { status: 500 }
        );
    }
}
