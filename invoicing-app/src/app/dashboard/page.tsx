'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { TrendingUp, Banknote, Users, FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Eye, Calendar, Mail, Phone, Building, RefreshCw, Download, Bell } from 'lucide-react';

// Simple date formatter
const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

interface DashboardStats {
    revenue: {
        total: number;
        thisMonth: number;
        pending: number;
    };
    invoices: {
        total: number;
        draft: number;
        sent: number;
        paid: number;
        overdue: number;
        cancelled: number;
    };
    clients: {
        total: number;
    };
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    status: string;
    total: number;
    createdAt: string;
    client?: {
        name: string;
        email?: string;
    };
}

interface Client {
    id: string;
    name: string;
    email?: string;
    company?: string;
    phone?: string;
}

interface RecentActivity {
    invoices: Invoice[];
    clients: Client[];
}

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [user, router]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [statsRes, recentRes] = await Promise.all([
                fetch('/api/dashboard/stats'),
                fetch('/api/dashboard/recent')
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (recentRes.ok) {
                const recentData = await recentRes.json();
                setRecentActivity(recentData);
            }

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    const handleExportData = () => {
        const data = {
            stats,
            recentActivity,
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'text-gray-600 bg-gray-100',
            sent: 'text-blue-600 bg-blue-100',
            paid: 'text-green-600 bg-green-100',
            overdue: 'text-red-600 bg-red-100',
            cancelled: 'text-gray-600 bg-gray-100'
        };
        return colors[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user.name}! Here&apos;s your business overview.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleExportData}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Export dashboard data"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors relative"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {(stats?.invoices.overdue || 0) > 0 && (
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {(stats?.invoices.overdue || 0) > 0 && (
                                            <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Overdue Invoices</p>
                                                        <p className="text-sm text-gray-600">You have {stats?.invoices.overdue} overdue invoice{(stats?.invoices.overdue || 0) > 1 ? 's' : ''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {(stats?.invoices.draft || 0) > 0 && (
                                            <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <FileText className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Draft Invoices</p>
                                                        <p className="text-sm text-gray-600">{stats?.invoices.draft} invoice{(stats?.invoices.draft || 0) > 1 ? 's' : ''} waiting to be sent</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {(stats?.invoices.sent || 0) > 0 && (
                                            <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Pending Payments</p>
                                                        <p className="text-sm text-gray-600">{stats?.invoices.sent} invoice{(stats?.invoices.sent || 0) > 1 ? 's' : ''} awaiting payment</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {!stats?.invoices.overdue && !stats?.invoices.draft && !stats?.invoices.sent && (
                                            <div className="p-8 text-center text-gray-500">
                                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <Link
                        href="/invoices/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Invoice
                    </Link>
                    <Link
                        href="/clients"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Client
                    </Link>
                    <Link
                        href="/invoices"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        <Eye className="w-5 h-5 mr-2" />
                        View All Invoices
                    </Link>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Banknote className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm text-green-600 flex items-center font-semibold">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +12%
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            Rs. {stats?.revenue.total?.toLocaleString('en-US') || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">All time earnings</p>
                    </div>

                    {/* This Month */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm text-green-600 font-semibold">This Month</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            Rs. {stats?.revenue.thisMonth?.toLocaleString('en-US') || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(new Date())}</p>
                    </div>

                    {/* Pending Payments */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="text-sm text-yellow-700 font-semibold">
                                {(stats?.invoices.sent || 0) + (stats?.invoices.overdue || 0)} Pending
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            Rs. {stats?.revenue.pending?.toLocaleString('en-US') || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Awaiting payment</p>
                    </div>

                    {/* Total Clients */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <Link href="/clients" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                                View All →
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">Total Clients</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {stats?.clients.total || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Active customers</p>
                    </div>
                </div>

                {/* Invoice Status Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{stats?.invoices.total || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Invoices</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-700">{stats?.invoices.draft || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Drafts</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-700">{stats?.invoices.sent || 0}</p>
                            <p className="text-sm text-blue-600 mt-1">Sent</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-700">{stats?.invoices.paid || 0}</p>
                            <p className="text-sm text-green-600 mt-1">Paid</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-red-700">{stats?.invoices.overdue || 0}</p>
                            <p className="text-sm text-red-600 mt-1">Overdue</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Invoices */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
                            <Link
                                href="/invoices"
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center font-medium"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="p-6">
                            {recentActivity?.invoices && recentActivity.invoices.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.invoices.map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => router.push(`/invoices/${invoice.id}`)}
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    <Users className="w-3 h-3 mr-1" />
                                                    {invoice.client?.name || 'No Client'}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(invoice.createdAt)}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-gray-900">Rs. {invoice.total?.toLocaleString('en-US')}</p>
                                                <span className={`text-xs px-3 py-1 rounded-full inline-block mt-2 font-medium ${getStatusColor(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                                    <p className="font-medium">No invoices yet</p>
                                    <p className="text-sm mt-1">Start by creating your first invoice</p>
                                    <Link
                                        href="/invoices/new"
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Invoice
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Clients */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                            <Link
                                href="/clients"
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center font-medium"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="p-6">
                            {recentActivity?.clients && recentActivity.clients.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.clients.map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => router.push(`/clients/${client.id}`)}
                                        >
                                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shrink-0">
                                                <span className="text-white font-bold text-lg">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{client.name}</p>
                                                {client.email && (
                                                    <p className="text-sm text-gray-600 flex items-center mt-1 truncate">
                                                        <Mail className="w-3 h-3 mr-1 shrink-0" />
                                                        {client.email}
                                                    </p>
                                                )}
                                                {client.company && (
                                                    <p className="text-xs text-gray-500 flex items-center mt-1 truncate">
                                                        <Building className="w-3 h-3 mr-1 shrink-0" />
                                                        {client.company}
                                                    </p>
                                                )}
                                                {client.phone && (
                                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                                        <Phone className="w-3 h-3 mr-1 shrink-0" />
                                                        {client.phone}
                                                    </p>
                                                )}
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 ml-2" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                                    <p className="font-medium">No clients yet</p>
                                    <p className="text-sm mt-1">Add your first client to get started</p>
                                    <Link
                                        href="/clients"
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Client
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
