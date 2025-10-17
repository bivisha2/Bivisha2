import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        // Get user (in production, get from authenticated session)
        const users = await prisma.user.findMany();
        
        if (users.length === 0) {
            return NextResponse.json({
                revenue: [],
                statusDistribution: []
            });
        }

        const userId = users[0].id;

        // Get revenue for last 6 months
        const revenueData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);

            const monthInvoices = await prisma.invoice.findMany({
                where: {
                    userId,
                    status: 'paid',
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                },
                select: {
                    total: true
                }
            });

            const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);

            revenueData.push({
                month: format(date, 'MMM'),
                revenue: total
            });
        }

        // Get invoice status distribution
        const allInvoices = await prisma.invoice.findMany({
            where: { userId },
            select: {
                status: true
            }
        });

        // Count by status
        const statusMap = new Map<string, number>();
        allInvoices.forEach(inv => {
            const status = inv.status;
            statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });

        const pieData = Array.from(statusMap.entries()).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count
        }));

        return NextResponse.json({
            revenue: revenueData,
            statusDistribution: pieData
        });

    } catch (error) {
        console.error('Charts data error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chart data' },
            { status: 500 }
        );
    }
}
