'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import Button from '@/components/Button';
import Breadcrumb from '@/components/Breadcrumb';

export default function Invoices() {
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data - in real app this would come from API
    const invoices = [
        {
            id: 'INV-001',
            client: 'Acme Corporation',
            amount: 2500,
            status: 'paid',
            date: '2025-09-20',
            dueDate: '2025-09-25'
        },
        {
            id: 'INV-002',
            client: 'Tech Solutions Ltd',
            amount: 1800,
            status: 'pending',
            date: '2025-09-18',
            dueDate: '2025-10-03'
        },
        {
            id: 'INV-003',
            client: 'Creative Design Studio',
            amount: 3200,
            status: 'overdue',
            date: '2025-09-15',
            dueDate: '2025-09-30'
        },
        {
            id: 'INV-004',
            client: 'StartupXYZ',
            amount: 950,
            status: 'draft',
            date: '2025-09-22',
            dueDate: '2025-10-07'
        },
        {
            id: 'INV-005',
            client: 'Global Enterprises',
            amount: 4200,
            status: 'paid',
            date: '2025-09-19',
            dueDate: '2025-09-26'
        }
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

    const getStatusCount = (status: string) => {
        if (status === 'all') return invoices.length;
        return invoices.filter(invoice => invoice.status === status).length;
    };

    const filteredInvoices = selectedFilter === 'all'
        ? invoices
        : invoices.filter(invoice => invoice.status === selectedFilter);

    const breadcrumbItems = [
        { label: 'Invoices' }
    ];

    const filterOptions = [
        { value: 'all', label: 'All Invoices', count: getStatusCount('all') },
        { value: 'draft', label: 'Draft', count: getStatusCount('draft') },
        { value: 'pending', label: 'Pending', count: getStatusCount('pending') },
        { value: 'paid', label: 'Paid', count: getStatusCount('paid') },
        { value: 'overdue', label: 'Overdue', count: getStatusCount('overdue') }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} className="mb-4" />

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-600 mt-2">Manage all your invoices in one place</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-green-600">$</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                            </div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">{getStatusCount('overdue')}</p>
                            </div>
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === option.value
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {option.label} ({option.count})
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 w-full lg:w-auto">
                            <SearchBox
                                placeholder="Search invoices..."
                                className="w-full lg:w-64"
                                onSearch={(query) => console.log('Search:', query)}
                            />
                            <Link href="/invoices/new">
                                <Button variant="primary" className="flex items-center whitespace-nowrap">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Invoice
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {filteredInvoices.length > 0 ? (
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
                                            Due Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredInvoices.map((invoice) => (
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
                                                {new Date(invoice.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900 transition-colors" title="View">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900 transition-colors" title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-900 transition-colors" title="Download">
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 transition-colors" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {selectedFilter === 'all' ? 'No invoices yet' : `No ${selectedFilter} invoices`}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {selectedFilter === 'all'
                                    ? 'Get started by creating your first invoice'
                                    : `You don't have any ${selectedFilter} invoices at the moment`
                                }
                            </p>
                            <Link href="/invoices/new">
                                <Button variant="primary">
                                    Create Your First Invoice
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}