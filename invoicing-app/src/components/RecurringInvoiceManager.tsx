'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat, Play, Pause, Trash2, Plus, Edit, CheckCircle, AlertCircle } from 'lucide-react';

interface RecurringInvoice {
    id: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    description: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: string;
    endDate?: string;
    nextGenerationDate: string;
    lastGeneratedDate?: string;
    isActive: boolean;
    generatedCount: number;
    autoSend: boolean;
    templateId?: string;
    notes?: string;
    createdAt: string;
}

interface RecurringInvoiceManagerProps {
    onGenerateInvoice?: (recurringInvoice: RecurringInvoice) => void;
    recurringInvoices?: RecurringInvoice[];
}

const RecurringInvoiceManager: React.FC<RecurringInvoiceManagerProps> = ({
    onGenerateInvoice,
    recurringInvoices: externalRecurringInvoices,
}) => {
    const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>(
        externalRecurringInvoices || [
            {
                id: 'recurring-1',
                clientId: 'client-1',
                clientName: 'Acme Corporation',
                clientEmail: 'billing@acme.com',
                description: 'Monthly Software Subscription',
                amount: 50000,
                frequency: 'monthly',
                startDate: '2025-01-01',
                nextGenerationDate: '2025-12-01',
                lastGeneratedDate: '2025-11-01',
                isActive: true,
                generatedCount: 11,
                autoSend: true,
                notes: 'Enterprise plan with priority support',
                createdAt: '2025-01-01T00:00:00Z',
            },
            {
                id: 'recurring-2',
                clientId: 'client-2',
                clientName: 'TechStart Inc',
                clientEmail: 'finance@techstart.com',
                description: 'Weekly Consulting Services',
                amount: 25000,
                frequency: 'weekly',
                startDate: '2025-10-01',
                nextGenerationDate: '2025-11-15',
                lastGeneratedDate: '2025-11-08',
                isActive: true,
                generatedCount: 6,
                autoSend: false,
                notes: 'Review hours logged each week',
                createdAt: '2025-10-01T00:00:00Z',
            },
            {
                id: 'recurring-3',
                clientId: 'client-3',
                clientName: 'Global Enterprises',
                clientEmail: 'ap@globalent.com',
                description: 'Quarterly Maintenance Contract',
                amount: 150000,
                frequency: 'quarterly',
                startDate: '2025-01-15',
                endDate: '2026-01-15',
                nextGenerationDate: '2026-01-15',
                lastGeneratedDate: '2025-10-15',
                isActive: true,
                generatedCount: 3,
                autoSend: true,
                notes: 'Includes on-site visits and 24/7 support',
                createdAt: '2025-01-15T00:00:00Z',
            },
        ]
    );

    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

    const [newRecurring, setNewRecurring] = useState<Partial<RecurringInvoice>>({
        clientName: '',
        clientEmail: '',
        description: '',
        amount: 0,
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        isActive: true,
        autoSend: false,
    });

    // Calculate next generation date based on frequency
    const calculateNextDate = (lastDate: string, frequency: string): string => {
        const date = new Date(lastDate);
        
        switch (frequency) {
            case 'daily':
                date.setDate(date.getDate() + 1);
                break;
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'biweekly':
                date.setDate(date.getDate() + 14);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'quarterly':
                date.setMonth(date.getMonth() + 3);
                break;
            case 'yearly':
                date.setFullYear(date.getFullYear() + 1);
                break;
        }
        
        return date.toISOString().split('T')[0];
    };

    // Get frequency display text
    const getFrequencyText = (frequency: string): string => {
        const map: Record<string, string> = {
            daily: 'Every Day',
            weekly: 'Every Week',
            biweekly: 'Every 2 Weeks',
            monthly: 'Every Month',
            quarterly: 'Every 3 Months',
            yearly: 'Every Year',
        };
        return map[frequency] || frequency;
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Check if invoice is due for generation
    const isDueForGeneration = (invoice: RecurringInvoice): boolean => {
        const today = new Date();
        const nextDate = new Date(invoice.nextGenerationDate);
        return today >= nextDate && invoice.isActive;
    };

    // Toggle active status
    const handleToggleActive = (id: string) => {
        setRecurringInvoices((prev) =>
            prev.map((inv) =>
                inv.id === id ? { ...inv, isActive: !inv.isActive } : inv
            )
        );
    };

    // Delete recurring invoice
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this recurring invoice?')) {
            setRecurringInvoices((prev) => prev.filter((inv) => inv.id !== id));
        }
    };

    // Generate invoice manually
    const handleGenerateNow = (invoice: RecurringInvoice) => {
        const updatedInvoice = {
            ...invoice,
            lastGeneratedDate: new Date().toISOString().split('T')[0],
            nextGenerationDate: calculateNextDate(
                new Date().toISOString().split('T')[0],
                invoice.frequency
            ),
            generatedCount: invoice.generatedCount + 1,
        };

        setRecurringInvoices((prev) =>
            prev.map((inv) => (inv.id === invoice.id ? updatedInvoice : inv))
        );

        if (onGenerateInvoice) {
            onGenerateInvoice(updatedInvoice);
        }

        alert(`Invoice generated successfully for ${invoice.clientName}!`);
    };

    // Create new recurring invoice
    const handleCreateNew = () => {
        if (!newRecurring.clientName || !newRecurring.description || !newRecurring.amount) {
            alert('Please fill in all required fields');
            return;
        }

        const nextDate = calculateNextDate(
            newRecurring.startDate || new Date().toISOString().split('T')[0],
            newRecurring.frequency || 'monthly'
        );

        const recurring: RecurringInvoice = {
            id: `recurring-${Date.now()}`,
            clientId: `client-${Date.now()}`,
            clientName: newRecurring.clientName!,
            clientEmail: newRecurring.clientEmail || '',
            description: newRecurring.description!,
            amount: newRecurring.amount!,
            frequency: newRecurring.frequency as RecurringInvoice['frequency'] || 'monthly',
            startDate: newRecurring.startDate || new Date().toISOString().split('T')[0],
            endDate: newRecurring.endDate,
            nextGenerationDate: nextDate,
            isActive: true,
            generatedCount: 0,
            autoSend: newRecurring.autoSend || false,
            notes: newRecurring.notes,
            createdAt: new Date().toISOString(),
        };

        setRecurringInvoices((prev) => [...prev, recurring]);
        setIsCreatingNew(false);
        setNewRecurring({
            clientName: '',
            clientEmail: '',
            description: '',
            amount: 0,
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            isActive: true,
            autoSend: false,
        });
    };

    // Filter invoices
    const filteredInvoices = recurringInvoices.filter((inv) => {
        if (filter === 'active') return inv.isActive;
        if (filter === 'paused') return !inv.isActive;
        return true;
    });

    // Count statistics
    const stats = {
        total: recurringInvoices.length,
        active: recurringInvoices.filter((inv) => inv.isActive).length,
        paused: recurringInvoices.filter((inv) => !inv.isActive).length,
        dueToday: recurringInvoices.filter((inv) => isDueForGeneration(inv)).length,
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recurring Invoices</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Automate your regular billing with scheduled invoices
                    </p>
                </div>
                <button
                    onClick={() => setIsCreatingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Recurring Invoice
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Repeat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-600 rounded-lg">
                            <Pause className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Paused</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.paused}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-600 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Due Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.dueToday}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'active'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Active ({stats.active})
                </button>
                <button
                    onClick={() => setFilter('paused')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'paused'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Paused ({stats.paused})
                </button>
            </div>

            {/* Create New Form */}
            {isCreatingNew && (
                <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Create New Recurring Invoice
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                value={newRecurring.clientName}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, clientName: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Client name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Email
                            </label>
                            <input
                                type="email"
                                value={newRecurring.clientEmail}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, clientEmail: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="client@email.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <input
                                type="text"
                                value={newRecurring.description}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, description: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Monthly subscription"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (Rs.) *
                            </label>
                            <input
                                type="number"
                                value={newRecurring.amount}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, amount: Number(e.target.value) })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Frequency *
                            </label>
                            <select
                                value={newRecurring.frequency}
                                onChange={(e) =>
                                    setNewRecurring({
                                        ...newRecurring,
                                        frequency: e.target.value as RecurringInvoice['frequency'],
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={newRecurring.startDate}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, startDate: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={newRecurring.endDate}
                                onChange={(e) =>
                                    setNewRecurring({ ...newRecurring, endDate: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newRecurring.autoSend}
                                    onChange={(e) =>
                                        setNewRecurring({ ...newRecurring, autoSend: e.target.checked })
                                    }
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Automatically send invoices to client
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleCreateNew}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Recurring Invoice
                        </button>
                        <button
                            onClick={() => setIsCreatingNew(false)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Recurring Invoices List */}
            <div className="space-y-4">
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <Repeat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No recurring invoices found</p>
                        <p className="text-gray-400 text-sm">
                            Create your first recurring invoice to get started
                        </p>
                    </div>
                ) : (
                    filteredInvoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className={`border rounded-lg p-6 transition-all hover:shadow-lg ${
                                invoice.isActive ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
                            } ${isDueForGeneration(invoice) ? 'ring-2 ring-orange-500' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {invoice.clientName}
                                        </h3>
                                        {isDueForGeneration(invoice) && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                                Due Now
                                            </span>
                                        )}
                                        {!invoice.isActive && (
                                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                                                Paused
                                            </span>
                                        )}
                                        {invoice.autoSend && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                Auto-send
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-3">{invoice.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Amount</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Rs. {invoice.amount.toLocaleString('en-US')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Frequency</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {getFrequencyText(invoice.frequency)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Next Invoice</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatDate(invoice.nextGenerationDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Generated</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {invoice.generatedCount} times
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleGenerateNow(invoice)}
                                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                        title="Generate invoice now"
                                    >
                                        <Play className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(invoice.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            invoice.isActive
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                        title={invoice.isActive ? 'Pause' : 'Resume'}
                                    >
                                        {invoice.isActive ? (
                                            <Pause className="w-4 h-4" />
                                        ) : (
                                            <Play className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecurringInvoiceManager;
