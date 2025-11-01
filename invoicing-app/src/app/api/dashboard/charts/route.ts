import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper functions to replace date-fns
function subMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function formatMonth(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}

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

            const total = monthInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0);

            revenueData.push({
                month: formatMonth(date),
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
        allInvoices.forEach((inv: any) => {
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
