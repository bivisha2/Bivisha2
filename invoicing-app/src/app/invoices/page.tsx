'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download, Copy, Send, CheckCircle, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import Button from '@/components/Button';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import { getAllInvoices, deleteInvoice, duplicateInvoice, updateInvoiceStatus, getInvoiceStats } from '@/services/invoiceService';
import type { Invoice, InvoiceStatus } from '@/types/invoice';

export default function Invoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<InvoiceStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'client'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [stats, setStats] = useState({
        totalInvoices: 0,
        paidCount: 0,
        sentCount: 0,
        overdueCount: 0,
        draftCount: 0,
        cancelledCount: 0,
        totalRevenue: 0,
        pendingAmount: 0,
        overdueAmount: 0
    });

    useEffect(() => {
        loadInvoices();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedFilter, searchQuery, invoices, dateFrom, dateTo, sortBy, sortOrder]);

    const loadInvoices = () => {
        const allInvoices = getAllInvoices();
        setInvoices(allInvoices);
        const statistics = getInvoiceStats();
        setStats(statistics);
    };

    const applyFilters = () => {
        let filtered = invoices;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(inv => inv.status === selectedFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(inv =>
                inv.invoiceNumber.toLowerCase().includes(query) ||
                inv.client.name.toLowerCase().includes(query) ||
                inv.client.company.toLowerCase().includes(query)
            );
        }

        // Date range filter
        if (dateFrom) {
            filtered = filtered.filter(inv => new Date(inv.issueDate) >= new Date(dateFrom));
        }
        if (dateTo) {
            filtered = filtered.filter(inv => new Date(inv.issueDate) <= new Date(dateTo));
        }

        // Sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
            } else if (sortBy === 'amount') {
                comparison = a.total - b.total;
            } else if (sortBy === 'client') {
                comparison = a.client.name.localeCompare(b.client.name);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredInvoices(filtered);
    };

    const handleDeleteClick = (id: string) => {
        setInvoiceToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (invoiceToDelete) {
            const success = deleteInvoice(invoiceToDelete);
            if (success) {
                showToastMessage('Invoice deleted successfully');
                loadInvoices();
            }
        }
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
    };

    const handleDuplicate = (id: string) => {
        const duplicated = duplicateInvoice(id);
        if (duplicated) {
            showToastMessage(`Invoice duplicated as ${duplicated.invoiceNumber}`);
            loadInvoices();
        }
    };

    const handleStatusChange = (id: string, status: InvoiceStatus) => {
        const updated = updateInvoiceStatus(id, status);
        if (updated) {
            showToastMessage(`Invoice status updated to ${status}`);
            loadInvoices();
        }
    };

    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const toggleSelectInvoice = (id: string) => {
        setSelectedInvoices(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedInvoices.length === filteredInvoices.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(filteredInvoices.map(inv => inv.id));
        }
    };

    const handleBulkDelete = () => {
        let deletedCount = 0;
        selectedInvoices.forEach(id => {
            if (deleteInvoice(id)) deletedCount++;
        });
        showToastMessage(`${deletedCount} invoice(s) deleted successfully`);
        setSelectedInvoices([]);
        loadInvoices();
    };

    const handleBulkStatusChange = (status: InvoiceStatus) => {
        let updatedCount = 0;
        selectedInvoices.forEach(id => {
            if (updateInvoiceStatus(id, status)) updatedCount++;
        });
        showToastMessage(`${updatedCount} invoice(s) updated to ${status}`);
        setSelectedInvoices([]);
        loadInvoices();
    };

    const handleDownloadInvoice = async (invoice: Invoice) => {
        try {
            // Simple download functionality - in production, use jsPDF
            showToastMessage('PDF download feature requires jsPDF library. Showing invoice details...');
            console.log('Invoice to download:', invoice);
            
            // For now, just show a message
            alert(`Invoice ${invoice.invoiceNumber}\nClient: ${invoice.client?.name}\nTotal: Rs. ${invoice.total}`);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            showToastMessage('Failed to download invoice');
        }
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'sent':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-gray-200 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4" />;
            case 'sent':
                return <Send className="h-4 w-4" />;
            case 'overdue':
                return <AlertCircle className="h-4 w-4" />;
            case 'draft':
                return <Edit className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
        }
    };

    const breadcrumbItems = [{ label: 'Invoices' }];

    const filterOptions: Array<{ value: InvoiceStatus | 'all'; label: string }> = [
        { value: 'all', label: 'All Invoices' },
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={breadcrumbItems} className="mb-4" />

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-600 mt-2">Manage and track all your invoices</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">
                                    Rs. {stats.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    Rs. {stats.pendingAmount.toLocaleString()}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">
                                    Rs. {stats.overdueAmount.toLocaleString()}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((option) => {
                                const count = option.value === 'all' ? stats.totalInvoices :
                                    option.value === 'draft' ? stats.draftCount :
                                        option.value === 'sent' ? stats.sentCount :
                                            option.value === 'paid' ? stats.paidCount :
                                                option.value === 'overdue' ? stats.overdueCount :
                                                    stats.cancelledCount;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedFilter(option.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === option.value
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {option.label} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center space-x-4 w-full lg:w-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search invoices..."
                                className="w-full lg:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Link href="/invoices/new">
                                <Button variant="primary" className="flex items-center whitespace-nowrap">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Invoice
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'client')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                    <option value="client">Client Name</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>
                        {(dateFrom || dateTo) && (
                            <button
                                onClick={() => { setDateFrom(''); setDateTo(''); }}
                                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear Date Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedInvoices.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleBulkStatusChange('sent')}
                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Mark as Sent
                                </button>
                                <button
                                    onClick={() => handleBulkStatusChange('paid')}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Mark as Paid
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedInvoices([])}
                                    className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Draft Info Banner */}
                {selectedFilter === 'draft' && stats.draftCount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-900">Draft Invoices</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    You have {stats.draftCount} draft invoice{stats.draftCount > 1 ? 's' : ''}.
                                    Drafts can be saved with incomplete information and edited later.
                                    Click the edit icon to complete and send them to clients.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invoices Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {filteredInvoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </th>
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
                                            Due Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInvoices.includes(invoice.id)}
                                                    onChange={() => toggleSelectInvoice(invoice.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {invoice.invoiceNumber}
                                                        </div>
                                                        {invoice.recurring !== 'none' && (
                                                            <div className="text-xs text-blue-600 flex items-center mt-1">
                                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                                {invoice.recurring}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {invoice.client.name || (
                                                        <span className="text-gray-400 italic">Draft Client</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {invoice.client.company || (
                                                        invoice.status === 'draft' ? (
                                                            <span className="text-xs text-amber-600">⚠ Incomplete</span>
                                                        ) : ''
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(invoice.issueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    Rs. {invoice.total.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                    {getStatusIcon(invoice.status)}
                                                    <span className="ml-1 capitalize">{invoice.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {invoice.status === 'draft' && (
                                                        <button
                                                            onClick={() => handleStatusChange(invoice.id, 'sent')}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Send Invoice"
                                                        >
                                                            <Send className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {invoice.status === 'sent' && (
                                                        <button
                                                            onClick={() => handleStatusChange(invoice.id, 'paid')}
                                                            className="text-green-600 hover:text-green-900 transition-colors"
                                                            title="Mark as Paid"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDownloadInvoice(invoice)}
                                                        className="text-purple-600 hover:text-purple-900 transition-colors"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDuplicate(invoice.id)}
                                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                                        title="Duplicate Invoice"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                    <Link href={`/invoices/${invoice.id}/edit`}>
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Edit Invoice"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(invoice.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete Invoice"
                                                    >
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
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {selectedFilter === 'all'
                                    ? 'Get started by creating a new invoice.'
                                    : `No ${selectedFilter} invoices found.`}
                            </p>
                            <div className="mt-6">
                                <Link href="/invoices/new">
                                    <Button variant="primary">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Invoice
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Invoice"
                >
                    <div className="p-6">
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this invoice? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <p className="text-sm font-medium text-gray-900">{toastMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
