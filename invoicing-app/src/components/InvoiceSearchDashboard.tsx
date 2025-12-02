'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, DollarSign, User, FileText, TrendingUp, TrendingDown, Download, Mail, Eye } from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
        total: number;
    }>;
}

interface InvoiceSearchDashboardProps {
    invoices?: Invoice[];
}

export default function InvoiceSearchDashboard({ invoices = [] }: InvoiceSearchDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
    const [amountRange, setAmountRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'client'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Mock data for demonstration
    const mockInvoices: Invoice[] = invoices.length > 0 ? invoices : [
        {
            id: '1',
            invoiceNumber: 'INV-2025-001',
            clientName: 'Tech Solutions Ltd',
            clientEmail: 'contact@techsolutions.com',
            amount: 25000,
            status: 'paid',
            issueDate: '2025-11-01',
            dueDate: '2025-12-01',
            items: [{ description: 'Web Development', quantity: 1, price: 25000, total: 25000 }]
        },
        {
            id: '2',
            invoiceNumber: 'INV-2025-002',
            clientName: 'Digital Marketing Pro',
            clientEmail: 'info@digitalmarketing.com',
            amount: 18500,
            status: 'sent',
            issueDate: '2025-11-05',
            dueDate: '2025-12-05',
            items: [{ description: 'SEO Services', quantity: 1, price: 18500, total: 18500 }]
        },
        {
            id: '3',
            invoiceNumber: 'INV-2025-003',
            clientName: 'Startup Innovations',
            clientEmail: 'hello@startupinno.com',
            amount: 42000,
            status: 'overdue',
            issueDate: '2025-10-15',
            dueDate: '2025-11-15',
            items: [{ description: 'Mobile App Development', quantity: 1, price: 42000, total: 42000 }]
        },
        {
            id: '4',
            invoiceNumber: 'INV-2025-004',
            clientName: 'E-Commerce Solutions',
            clientEmail: 'sales@ecommerce.com',
            amount: 15000,
            status: 'draft',
            issueDate: '2025-11-10',
            dueDate: '2025-12-10',
            items: [{ description: 'Website Maintenance', quantity: 1, price: 15000, total: 15000 }]
        },
        {
            id: '5',
            invoiceNumber: 'INV-2025-005',
            clientName: 'Cloud Services Inc',
            clientEmail: 'admin@cloudservices.com',
            amount: 55000,
            status: 'paid',
            issueDate: '2025-11-08',
            dueDate: '2025-12-08',
            items: [{ description: 'Cloud Infrastructure Setup', quantity: 1, price: 55000, total: 55000 }]
        },
    ];

    // Advanced filtering logic
    const filteredInvoices = useMemo(() => {
        let filtered = mockInvoices;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(inv =>
                inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(inv => inv.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(inv => {
                const invoiceDate = new Date(inv.issueDate);
                const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                switch (dateFilter) {
                    case 'today': return diffDays === 0;
                    case 'week': return diffDays <= 7;
                    case 'month': return diffDays <= 30;
                    case 'year': return diffDays <= 365;
                    default: return true;
                }
            });
        }

        // Amount range filter
        filtered = filtered.filter(inv =>
            inv.amount >= amountRange.min && inv.amount <= amountRange.max
        );

        // Sorting
        filtered.sort((a, b) => {
            let compareValue = 0;

            switch (sortBy) {
                case 'date':
                    compareValue = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
                    break;
                case 'amount':
                    compareValue = a.amount - b.amount;
                    break;
                case 'client':
                    compareValue = a.clientName.localeCompare(b.clientName);
                    break;
            }

            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    }, [mockInvoices, searchQuery, statusFilter, dateFilter, amountRange, sortBy, sortOrder]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const paid = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
        const pending = filteredInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
        const overdue = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

        return { total, paid, pending, overdue, count: filteredInvoices.length };
    }, [filteredInvoices]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 border-green-300';
            case 'sent': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
            case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'cancelled': return 'bg-orange-100 text-orange-800 border-orange-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">Rs. {stats.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{stats.count} invoices</p>
                        </div>
                        <DollarSign className="h-10 w-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Paid</p>
                            <p className="text-2xl font-bold text-green-700">Rs. {stats.paid.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{Math.round((stats.paid / stats.total) * 100)}% of total</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-blue-700">Rs. {stats.pending.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                        </div>
                        <FileText className="h-10 w-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Overdue</p>
                            <p className="text-2xl font-bold text-red-700">Rs. {stats.overdue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
                        </div>
                        <TrendingDown className="h-10 w-10 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Search className="h-4 w-4 inline mr-2" />
                            Search Invoices
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Invoice #, client name, or email..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Filter className="h-4 w-4 inline mr-2" />
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Date Range
                        </label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <button
                        onClick={() => setSortBy('date')}
                        className={`px-3 py-1 rounded ${sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Date
                    </button>
                    <button
                        onClick={() => setSortBy('amount')}
                        className={`px-3 py-1 rounded ${sortBy === 'amount' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Amount
                    </button>
                    <button
                        onClick={() => setSortBy('client')}
                        className={`px-3 py-1 rounded ${sortBy === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Client
                    </button>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700"
                    >
                        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                </div>
            </div>

            {/* Invoice List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                                <div className="text-xs text-gray-500">Due: {invoice.dueDate}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 text-gray-400 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                                                <div className="text-xs text-gray-500">{invoice.clientEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {invoice.issueDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">Rs. {invoice.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button className="text-blue-600 hover:text-blue-900" title="View">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900" title="Download">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-900" title="Send Email">
                                                <Mail className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredInvoices.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No invoices found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
