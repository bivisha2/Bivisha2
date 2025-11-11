'use client';

import React, { useState } from 'react';
import {
    TrendingUp,
    DollarSign,
    Users,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';

interface Invoice {
    id: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'draft';
    date: string;
    dueDate: string;
    clientId: string;
    clientName: string;
}

interface InvoiceAnalyticsDashboardProps {
    invoices?: Invoice[];
    dateRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

const InvoiceAnalyticsDashboard: React.FC<InvoiceAnalyticsDashboardProps> = ({
    invoices: externalInvoices,
    dateRange: initialDateRange = 'month',
}) => {
    // Sample data for demonstration
    const [invoices] = useState<Invoice[]>(
        externalInvoices || generateSampleInvoices()
    );

    const [dateRange, setDateRange] = useState(initialDateRange);

    // Filter invoices by date range
    const getFilteredInvoices = (): Invoice[] => {
        const now = new Date();
        const filtered = invoices.filter((inv) => {
            const invDate = new Date(inv.date);
            const diffDays = Math.floor(
                (now.getTime() - invDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            switch (dateRange) {
                case 'week':
                    return diffDays <= 7;
                case 'month':
                    return diffDays <= 30;
                case 'quarter':
                    return diffDays <= 90;
                case 'year':
                    return diffDays <= 365;
                default:
                    return true;
            }
        });

        return filtered;
    };

    const filteredInvoices = getFilteredInvoices();

    // Calculate key metrics
    const calculateMetrics = () => {
        const total = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const paid = filteredInvoices
            .filter((inv) => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.amount, 0);
        const pending = filteredInvoices
            .filter((inv) => inv.status === 'pending')
            .reduce((sum, inv) => sum + inv.amount, 0);
        const overdue = filteredInvoices
            .filter((inv) => inv.status === 'overdue')
            .reduce((sum, inv) => sum + inv.amount, 0);

        const uniqueClients = new Set(filteredInvoices.map((inv) => inv.clientId)).size;
        const avgInvoiceValue = filteredInvoices.length > 0 ? total / filteredInvoices.length : 0;
        const collectionRate = total > 0 ? (paid / total) * 100 : 0;

        return {
            total,
            paid,
            pending,
            overdue,
            uniqueClients,
            avgInvoiceValue,
            collectionRate,
            invoiceCount: filteredInvoices.length,
        };
    };

    const metrics = calculateMetrics();

    // Revenue trend by month
    const getRevenueTrend = () => {
        const monthlyData: Record<string, number> = {};

        filteredInvoices.forEach((inv) => {
            if (inv.status === 'paid') {
                const month = new Date(inv.date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                });
                monthlyData[month] = (monthlyData[month] || 0) + inv.amount;
            }
        });

        return Object.entries(monthlyData)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .slice(-6);
    };

    const revenueTrend = getRevenueTrend();
    const maxRevenue = Math.max(...revenueTrend.map(([, amount]) => amount), 1);

    // Status distribution
    const getStatusDistribution = () => {
        const distribution = {
            paid: 0,
            pending: 0,
            overdue: 0,
            draft: 0,
        };

        filteredInvoices.forEach((inv) => {
            distribution[inv.status]++;
        });

        const total = filteredInvoices.length || 1;

        return [
            { status: 'Paid', count: distribution.paid, percentage: (distribution.paid / total) * 100, color: 'bg-green-500' },
            { status: 'Pending', count: distribution.pending, percentage: (distribution.pending / total) * 100, color: 'bg-yellow-500' },
            { status: 'Overdue', count: distribution.overdue, percentage: (distribution.overdue / total) * 100, color: 'bg-red-500' },
            { status: 'Draft', count: distribution.draft, percentage: (distribution.draft / total) * 100, color: 'bg-gray-500' },
        ];
    };

    const statusDistribution = getStatusDistribution();

    // Top clients by revenue
    const getTopClients = () => {
        const clientRevenue: Record<string, { name: string; amount: number; count: number }> = {};

        filteredInvoices.forEach((inv) => {
            if (!clientRevenue[inv.clientId]) {
                clientRevenue[inv.clientId] = {
                    name: inv.clientName,
                    amount: 0,
                    count: 0,
                };
            }
            clientRevenue[inv.clientId].amount += inv.amount;
            clientRevenue[inv.clientId].count++;
        });

        return Object.entries(clientRevenue)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    };

    const topClients = getTopClients();

    // Calculate growth rate
    const calculateGrowthRate = () => {
        // Compare current period with previous period
        const currentPeriodRevenue = metrics.paid;
        // Simulate previous period (in real app, would calculate from historical data)
        const previousPeriodRevenue = currentPeriodRevenue * 0.85;
        const growthRate = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
        return growthRate;
    };

    const growthRate = calculateGrowthRate();

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoice Analytics</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Comprehensive insights into your invoicing performance
                    </p>
                </div>

                {/* Date Range Selector */}
                <div className="flex gap-2">
                    {(['week', 'month', 'quarter', 'year', 'all'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                dateRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-5 shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growthRate >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {Math.abs(growthRate).toFixed(1)}%
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                        Rs. {metrics.paid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        of Rs. {metrics.total.toLocaleString('en-US', { maximumFractionDigits: 0 })} invoiced
                    </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Activity className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                        Rs. {metrics.pending.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {((metrics.pending / metrics.total) * 100).toFixed(1)}% of total
                    </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Active Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.uniqueClients}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Avg: Rs. {metrics.avgInvoiceValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} per invoice
                    </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {metrics.collectionRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {metrics.invoiceCount} invoices processed
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                    </div>
                    <div className="space-y-4">
                        {revenueTrend.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No revenue data available</p>
                        ) : (
                            revenueTrend.map(([month, amount]) => (
                                <div key={month}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{month}</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            Rs. {amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-linear-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                                            style={{ width: `${(amount / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Invoice Status Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        {statusDistribution.map((item) => (
                            <div key={item.status}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">{item.count} invoices</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {item.percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${item.color} h-2 rounded-full transition-all`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Clients */}
            <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Top 5 Clients by Revenue</h3>
                </div>
                {topClients.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No client data available</p>
                ) : (
                    <div className="space-y-4">
                        {topClients.map((client, index) => (
                            <div
                                key={client.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{client.name}</p>
                                        <p className="text-sm text-gray-600">{client.count} invoices</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                        Rs. {client.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Avg: Rs. {(client.amount / client.count).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Forecast Card */}
            <div className="mt-6 bg-linear-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Revenue Forecast</h3>
                        <p className="text-purple-100 mb-4">
                            Based on current trends and pending invoices
                        </p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-bold">
                                Rs. {(metrics.paid + metrics.pending * 0.8).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-lg text-purple-100">expected this period</p>
                        </div>
                    </div>
                    <Calendar className="w-16 h-16 text-purple-200" />
                </div>
                <div className="mt-4 pt-4 border-t border-purple-400 flex items-center gap-6">
                    <div>
                        <p className="text-sm text-purple-200">Outstanding</p>
                        <p className="text-lg font-semibold">
                            Rs. {(metrics.pending + metrics.overdue).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-purple-200">Expected Collection Rate</p>
                        <p className="text-lg font-semibold">80%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to generate sample data
function generateSampleInvoices(): Invoice[] {
    const clients = [
        { id: 'client-1', name: 'Acme Corporation' },
        { id: 'client-2', name: 'TechStart Inc' },
        { id: 'client-3', name: 'Global Enterprises' },
        { id: 'client-4', name: 'Innovation Labs' },
        { id: 'client-5', name: 'Digital Solutions' },
    ];

    const statuses: Array<'paid' | 'pending' | 'overdue' | 'draft'> = ['paid', 'pending', 'overdue', 'draft'];
    const invoices: Invoice[] = [];

    for (let i = 0; i < 50; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const daysAgo = Math.floor(Math.random() * 180);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);

        invoices.push({
            id: `INV-${String(i + 1).padStart(4, '0')}`,
            amount: Math.floor(Math.random() * 200000) + 10000,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: date.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            clientId: client.id,
            clientName: client.name,
        });
    }

    return invoices;
}

export default InvoiceAnalyticsDashboard;
