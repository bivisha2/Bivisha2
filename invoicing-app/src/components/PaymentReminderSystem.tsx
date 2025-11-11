'use client';

import { useState, useEffect } from 'react';
import { Bell, Clock, Mail, AlertTriangle, CheckCircle, X, Send } from 'lucide-react';

interface OverdueInvoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
    lastReminderSent?: string;
    reminderCount: number;
}

interface PaymentReminderSystemProps {
    invoices?: OverdueInvoice[];
    onSendReminder?: (invoiceId: string) => void;
    onDismiss?: (invoiceId: string) => void;
}

export default function PaymentReminderSystem({
    invoices = [],
    onSendReminder,
    onDismiss
}: PaymentReminderSystemProps) {
    const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>(invoices);
    const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
    const [filterBy, setFilterBy] = useState<'all' | 'critical' | 'moderate' | 'recent'>('all');
    const [showModal, setShowModal] = useState(false);
    const [reminderMessage, setReminderMessage] = useState('');
    const [sendingReminders, setSendingReminders] = useState(false);

    useEffect(() => {
        setOverdueInvoices(invoices);
    }, [invoices]);

    const getUrgencyLevel = (daysOverdue: number): 'critical' | 'moderate' | 'recent' => {
        if (daysOverdue >= 30) return 'critical';
        if (daysOverdue >= 15) return 'moderate';
        return 'recent';
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'moderate':
                return 'bg-orange-100 border-orange-300 text-orange-800';
            case 'recent':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'moderate':
                return <Clock className="w-5 h-5 text-orange-600" />;
            case 'recent':
                return <Bell className="w-5 h-5 text-yellow-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const filteredInvoices = overdueInvoices.filter((invoice) => {
        if (filterBy === 'all') return true;
        return getUrgencyLevel(invoice.daysOverdue) === filterBy;
    });

    const handleSelectInvoice = (invoiceId: string) => {
        const newSelected = new Set(selectedInvoices);
        if (newSelected.has(invoiceId)) {
            newSelected.delete(invoiceId);
        } else {
            newSelected.add(invoiceId);
        }
        setSelectedInvoices(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedInvoices.size === filteredInvoices.length) {
            setSelectedInvoices(new Set());
        } else {
            setSelectedInvoices(new Set(filteredInvoices.map((inv) => inv.id)));
        }
    };

    const handleSendReminders = async () => {
        setSendingReminders(true);
        try {
            // Simulate sending reminders
            for (const invoiceId of selectedInvoices) {
                if (onSendReminder) {
                    await onSendReminder(invoiceId);
                }
                // Update local state
                setOverdueInvoices((prev) =>
                    prev.map((inv) =>
                        inv.id === invoiceId
                            ? {
                                  ...inv,
                                  lastReminderSent: new Date().toISOString(),
                                  reminderCount: inv.reminderCount + 1,
                              }
                            : inv
                    )
                );
            }
            setSelectedInvoices(new Set());
            setShowModal(false);
            setReminderMessage('');
        } catch (error) {
            console.error('Failed to send reminders:', error);
        } finally {
            setSendingReminders(false);
        }
    };

    const handleDismissInvoice = (invoiceId: string) => {
        if (onDismiss) {
            onDismiss(invoiceId);
        }
        setOverdueInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
        selectedInvoices.delete(invoiceId);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const totalOverdueAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Payment Reminders</h2>
                        <p className="text-sm text-gray-600">
                            {filteredInvoices.length} overdue invoice{filteredInvoices.length !== 1 ? 's' : ''} · Rs.{' '}
                            {totalOverdueAmount.toLocaleString('en-US')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Overdue</option>
                        <option value="critical">Critical (30+ days)</option>
                        <option value="moderate">Moderate (15-29 days)</option>
                        <option value="recent">Recent (1-14 days)</option>
                    </select>
                    {selectedInvoices.size > 0 && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Send Reminders ({selectedInvoices.size})
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-700">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">
                        {overdueInvoices.filter((inv) => getUrgencyLevel(inv.daysOverdue) === 'critical').length}
                    </p>
                    <p className="text-xs text-red-600 mt-1">30+ days overdue</p>
                </div>
                <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-700">Moderate</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-800">
                        {overdueInvoices.filter((inv) => getUrgencyLevel(inv.daysOverdue) === 'moderate').length}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">15-29 days overdue</p>
                </div>
                <div className="p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">Recent</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-800">
                        {overdueInvoices.filter((inv) => getUrgencyLevel(inv.daysOverdue) === 'recent').length}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">1-14 days overdue</p>
                </div>
            </div>

            {/* Invoice List */}
            <div className="space-y-3">
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No overdue invoices in this category</p>
                        <p className="text-sm text-gray-500">All payments are on track!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {selectedInvoices.size > 0
                                    ? `${selectedInvoices.size} selected`
                                    : 'Select all'}
                            </span>
                        </div>
                        {filteredInvoices.map((invoice) => {
                            const urgency = getUrgencyLevel(invoice.daysOverdue);
                            return (
                                <div
                                    key={invoice.id}
                                    className={`border-2 rounded-lg p-4 transition-all ${getUrgencyColor(urgency)} ${
                                        selectedInvoices.has(invoice.id) ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedInvoices.has(invoice.id)}
                                            onChange={() => handleSelectInvoice(invoice.id)}
                                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="shrink-0">{getUrgencyIcon(urgency)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {invoice.invoiceNumber}
                                                    </h3>
                                                    <p className="text-sm text-gray-700">{invoice.clientName}</p>
                                                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                                        <Mail className="w-3 h-3" />
                                                        {invoice.clientEmail}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        Rs. {invoice.amount.toLocaleString('en-US')}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="font-semibold text-gray-700">
                                                        {invoice.daysOverdue} days overdue
                                                    </span>
                                                    {invoice.lastReminderSent && (
                                                        <span className="text-gray-600">
                                                            Last reminder: {formatDate(invoice.lastReminderSent)}
                                                        </span>
                                                    )}
                                                    <span className="text-gray-600">
                                                        Reminders sent: {invoice.reminderCount}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDismissInvoice(invoice.id)}
                                                    className="p-1 hover:bg-white/50 rounded transition-colors"
                                                    title="Dismiss"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Send Reminder Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Send Payment Reminders</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            You are about to send payment reminders for {selectedInvoices.size} invoice
                            {selectedInvoices.size !== 1 ? 's' : ''}.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Message (Optional)
                            </label>
                            <textarea
                                value={reminderMessage}
                                onChange={(e) => setReminderMessage(e.target.value)}
                                placeholder="Add a personalized message to your reminder..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={4}
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={sendingReminders}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReminders}
                                disabled={sendingReminders}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {sendingReminders ? 'Sending...' : 'Send Reminders'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
