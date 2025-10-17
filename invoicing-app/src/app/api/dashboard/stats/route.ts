import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // For now, we'll get user from session/auth
        // In production, get from authenticated session
        const users = await prisma.user.findMany();
        
        if (users.length === 0) {
            return NextResponse.json({
                revenue: { total: 0, thisMonth: 0, pending: 0 },
                invoices: { total: 0, draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 },
                clients: { total: 0 }
            });
        }

        const userId = users[0].id; // Use first user for demo

        // Get all invoices for stats
        const allInvoices = await prisma.invoice.findMany({
            where: { userId },
            select: {
                status: true,
                total: true,
                createdAt: true
            }
        });

        // Calculate revenue
        const paidInvoices = allInvoices.filter(inv => inv.status === 'paid');
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // Get this month's revenue
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthInvoices = paidInvoices.filter(inv => 
            new Date(inv.createdAt) >= startOfMonth
        );
        const thisMonthRevenue = thisMonthInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // Get pending payments
        const pendingInvoices = allInvoices.filter(inv => 
            inv.status === 'sent' || inv.status === 'overdue'
        );
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // Count invoices by status
        const statusCounts = {
            draft: allInvoices.filter(inv => inv.status === 'draft').length,
            sent: allInvoices.filter(inv => inv.status === 'sent').length,
            paid: allInvoices.filter(inv => inv.status === 'paid').length,
            overdue: allInvoices.filter(inv => inv.status === 'overdue').length,
            cancelled: allInvoices.filter(inv => inv.status === 'cancelled').length
        };

        // Get total clients
        const clientCount = await prisma.client.count({
            where: { userId }
        });

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                thisMonth: thisMonthRevenue,
                pending: pendingAmount
            },
            invoices: {
                total: allInvoices.length,
                ...statusCounts
            },
            clients: {
                total: clientCount
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}
