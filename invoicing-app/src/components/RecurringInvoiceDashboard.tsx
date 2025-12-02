'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';
import Toast from './Toast';

interface RecurringInvoice {
    id: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';
    startDate: string;
    nextDate: string;
    endDate?: string;
    isActive: boolean;
    description: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
    createdAt: string;
}

interface CreateRecurringInvoiceForm {
    clientName: string;
    clientEmail: string;
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';
    startDate: string;
    endDate: string;
    description: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
}

const RecurringInvoiceDashboard: React.FC = () => {
    const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([
        {
            id: '1',
            clientName: 'Acme Corp',
            clientEmail: 'contact@acme.com',
            amount: 5000,
            frequency: 'monthly',
            startDate: '2025-01-01',
            nextDate: '2025-11-28',
            endDate: '2025-12-31',
            isActive: true,
            description: 'Monthly subscription service',
            items: [{ description: 'Monthly service', quantity: 1, price: 5000 }],
            createdAt: '2025-01-01'
        },
        {
            id: '2',
            clientName: 'Tech Startup',
            clientEmail: 'billing@techstartup.com',
            amount: 2500,
            frequency: 'biweekly',
            startDate: '2025-01-15',
            nextDate: '2025-12-01',
            isActive: true,
            description: 'Bi-weekly maintenance and support',
            items: [{ description: 'Support services', quantity: 2, price: 1250 }],
            createdAt: '2025-01-15'
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateRecurringInvoiceForm>({
        clientName: '',
        clientEmail: '',
        amount: 0,
        frequency: 'monthly',
        startDate: '',
        endDate: '',
        description: '',
        items: [{ description: '', quantity: 1, price: 0 }]
    });
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
    const [showToast, setShowToast] = useState(false);

    const activeInvoices = useMemo(() => {
        return recurringInvoices.filter(inv => inv.isActive);
    }, [recurringInvoices]);

    const totalMonthlyRecurring = useMemo(() => {
        return activeInvoices
            .filter(inv => inv.frequency === 'monthly')
            .reduce((sum, inv) => sum + inv.amount, 0);
    }, [activeInvoices]);

    const handleCreateOrUpdate = () => {
        if (!formData.clientName || !formData.clientEmail || formData.amount <= 0) {
            setToastMessage('Please fill in all required fields');
            setToastType('error');
            setShowToast(true);
            return;
        }

        if (editingId) {
            setRecurringInvoices(invoices =>
                invoices.map(inv =>
                    inv.id === editingId
                        ? {
                            ...inv,
                            clientName: formData.clientName,
                            clientEmail: formData.clientEmail,
                            amount: formData.amount,
                            frequency: formData.frequency,
                            startDate: formData.startDate,
                            endDate: formData.endDate,
                            description: formData.description,
                            items: formData.items
                        }
                        : inv
                )
            );
            setToastMessage('Recurring invoice updated successfully');
        } else {
            const newRecurring: RecurringInvoice = {
                id: Date.now().toString(),
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                amount: formData.amount,
                frequency: formData.frequency,
                startDate: formData.startDate,
                nextDate: formData.startDate,
                endDate: formData.endDate || undefined,
                isActive: true,
                description: formData.description,
                items: formData.items,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setRecurringInvoices([...recurringInvoices, newRecurring]);
            setToastMessage('Recurring invoice created successfully');
        }

        setToastType('success');
        setShowToast(true);
        setShowCreateModal(false);
        resetForm();
    };

    const handleEdit = (invoice: RecurringInvoice) => {
        setFormData({
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            amount: invoice.amount,
            frequency: invoice.frequency,
            startDate: invoice.startDate,
            endDate: invoice.endDate || '',
            description: invoice.description,
            items: invoice.items
        });
        setEditingId(invoice.id);
        setShowCreateModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this recurring invoice?')) {
            setRecurringInvoices(invoices => invoices.filter(inv => inv.id !== id));
            setToastMessage('Recurring invoice deleted');
            setToastType('info');
            setShowToast(true);
        }
    };

    const handleToggleActive = (id: string) => {
        setRecurringInvoices(invoices =>
            invoices.map(inv =>
                inv.id === id ? { ...inv, isActive: !inv.isActive } : inv
            )
        );
    };

    const resetForm = () => {
        setFormData({
            clientName: '',
            clientEmail: '',
            amount: 0,
            frequency: 'monthly',
            startDate: '',
            endDate: '',
            description: '',
            items: [{ description: '', quantity: 1, price: 0 }]
        });
        setEditingId(null);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        resetForm();
    };

    const frequencyLabels: Record<string, string> = {
        weekly: 'Weekly',
        biweekly: 'Bi-weekly',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        annual: 'Annual'
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recurring Invoices</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Recurring Invoice
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Active Recurring</p>
                            <p className="text-2xl font-bold text-blue-900">{activeInvoices.length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Monthly Revenue</p>
                            <p className="text-2xl font-bold text-green-900">${totalMonthlyRecurring.toLocaleString()}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-green-400" />
                    </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Total Recurring</p>
                            <p className="text-2xl font-bold text-purple-900">{recurringInvoices.length}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Recurring Invoices Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Client</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Frequency</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Next Date</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurringInvoices.map(invoice => (
                            <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{invoice.clientName}</p>
                                        <p className="text-xs text-gray-500">{invoice.clientEmail}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    ${invoice.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {frequencyLabels[invoice.frequency]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{invoice.nextDate}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleActive(invoice.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            invoice.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {invoice.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(invoice)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
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

            {/* Create/Edit Modal */}
            <Modal isOpen={showCreateModal} onClose={handleCloseModal} title={editingId ? 'Edit Recurring Invoice' : 'Create Recurring Invoice'}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Client Email"
                            value={formData.clientEmail}
                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annual</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                    />

                    <div className="flex space-x-2">
                        <Button variant="primary" onClick={handleCreateOrUpdate} className="flex-1">
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default RecurringInvoiceDashboard;
