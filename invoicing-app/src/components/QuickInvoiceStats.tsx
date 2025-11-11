'use client';

import { FileText, TrendingUp, Banknote, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface QuickStatsProps {
    totalInvoices: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    paidCount: number;
    overdueCount: number;
    growthPercentage?: number;
}

export default function QuickInvoiceStats({
    totalInvoices,
    paidAmount,
    pendingAmount,
    overdueAmount,
    paidCount,
    overdueCount,
    growthPercentage = 0
}: QuickStatsProps) {
    const stats = [
        {
            label: 'Total Invoices',
            value: totalInvoices.toString(),
            icon: FileText,
            color: 'bg-blue-100 text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Paid',
            value: `Rs. ${paidAmount.toLocaleString('en-US')}`,
            subValue: `${paidCount} invoices`,
            icon: CheckCircle,
            color: 'bg-green-100 text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Pending',
            value: `Rs. ${pendingAmount.toLocaleString('en-US')}`,
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            label: 'Overdue',
            value: `Rs. ${overdueAmount.toLocaleString('en-US')}`,
            subValue: `${overdueCount} invoices`,
            icon: AlertCircle,
            color: 'bg-red-100 text-red-600',
            bgColor: 'bg-red-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`${stat.bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        {index === 1 && growthPercentage !== 0 && (
                            <div className={`flex items-center text-xs font-medium ${growthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`h-3 w-3 mr-1 ${growthPercentage < 0 ? 'rotate-180' : ''}`} />
                                {Math.abs(growthPercentage)}%
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        {stat.subValue && (
                            <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
