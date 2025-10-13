'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import DatabaseStatus from '../../components/DatabaseStatus';
import {
    DollarSign,
    FileText,
    Users,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle,
    Plus,
    Eye
} from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    // Mock data - in real app this would come from API
    const stats = {
        totalRevenue: 45230,
        pendingInvoices: 12,
        totalClients: 156,
        overdue: 3
    };

    const recentInvoices = [
        { id: 'INV-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2025-09-20' },
        { id: 'INV-002', client: 'Tech Solutions', amount: 1800, status: 'pending', date: '2025-09-18' },
        { id: 'INV-003', client: 'Design Studio', amount: 3200, status: 'overdue', date: '2025-09-15' },
        { id: 'INV-004', client: 'StartupXYZ', amount: 950, status: 'draft', date: '2025-09-22' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-green-100 rounded-lg p-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                                <div className="flex items-center mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600 ml-1">+12% from last month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingInvoices}</p>
                                <div className="flex items-center mt-1">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm text-blue-600 ml-1">Awaiting payment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-purple-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                                <div className="flex items-center mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600 ml-1">+5 this month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-red-100 rounded-lg p-3">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                                <div className="flex items-center mt-1">
                                    <Clock className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-600 ml-1">Needs attention</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/invoices/new"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="font-medium text-gray-900">Create Invoice</span>
                        </Link>
                        <Link
                            href="/clients/new"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Users className="h-5 w-5 text-green-600 mr-3" />
                            <span className="font-medium text-gray-900">Add Client</span>
                        </Link>
                        <Link
                            href="/invoices"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="h-5 w-5 text-purple-600 mr-3" />
                            <span className="font-medium text-gray-900">View All Invoices</span>
                        </Link>
                        <Link
                            href="/reports"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <TrendingUp className="h-5 w-5 text-yellow-600 mr-3" />
                            <span className="font-medium text-gray-900">View Reports</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                            <Link
                                href="/invoices"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                View all
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {invoice.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.client}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${invoice.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Database Status */}
                <div className="mt-8">
                    <DatabaseStatus />
                </div>
            </div>
        </div>
    );
}