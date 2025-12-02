'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Bell, Send } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';
import Toast from './Toast';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    type: 'invoice' | 'reminder' | 'receipt' | 'custom';
    variables: string[];
    isDefault: boolean;
    createdAt: string;
}

interface NotificationRule {
    id: string;
    name: string;
    event: 'invoice_sent' | 'payment_received' | 'invoice_overdue' | 'reminder';
    emailTemplate: string;
    frequency: 'immediate' | 'daily' | 'weekly';
    enabled: boolean;
    createdAt: string;
}

const EmailNotificationSystem: React.FC = () => {
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
        {
            id: '1',
            name: 'Invoice Sent',
            subject: 'Your Invoice #{invoice_number}',
            body: 'Dear {client_name},\n\nPlease find your invoice attached.\n\nAmount: ${amount}\nDue Date: {due_date}\n\nThank you!',
            type: 'invoice',
            variables: ['client_name', 'invoice_number', 'amount', 'due_date'],
            isDefault: true,
            createdAt: '2025-01-01'
        },
        {
            id: '2',
            name: 'Payment Reminder',
            subject: 'Payment Reminder - Invoice #{invoice_number}',
            body: 'Dear {client_name},\n\nThis is a reminder about your unpaid invoice.\n\nInvoice: {invoice_number}\nAmount: ${amount}\nDue Date: {due_date}\n\nPlease pay as soon as possible.',
            type: 'reminder',
            variables: ['client_name', 'invoice_number', 'amount', 'due_date'],
            isDefault: false,
            createdAt: '2025-01-05'
        }
    ]);

    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
        {
            id: '1',
            name: 'Send invoice when created',
            event: 'invoice_sent',
            emailTemplate: '1',
            frequency: 'immediate',
            enabled: true,
            createdAt: '2025-01-01'
        },
        {
            id: '2',
            name: 'Send reminder for overdue invoices',
            event: 'invoice_overdue',
            emailTemplate: '2',
            frequency: 'daily',
            enabled: true,
            createdAt: '2025-01-10'
        }
    ]);

    const [activeTab, setActiveTab] = useState<'templates' | 'rules'>('templates');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [templateForm, setTemplateForm] = useState<Partial<EmailTemplate>>({
        name: '',
        subject: '',
        body: '',
        type: 'custom',
        variables: [],
        isDefault: false
    });

    const handleSaveTemplate = () => {
        if (!templateForm.name || !templateForm.subject || !templateForm.body) {
            setToastMessage('Please fill in all fields');
            setShowToast(true);
            return;
        }

        if (editingId) {
            setEmailTemplates(prev =>
                prev.map(t => t.id === editingId ? { ...t, ...templateForm } as EmailTemplate : t)
            );
            setToastMessage('Template updated');
        } else {
            const newTemplate: EmailTemplate = {
                id: Date.now().toString(),
                name: templateForm.name || '',
                subject: templateForm.subject || '',
                body: templateForm.body || '',
                type: templateForm.type || 'custom',
                variables: templateForm.variables || [],
                isDefault: false,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setEmailTemplates([...emailTemplates, newTemplate]);
            setToastMessage('Template created');
        }

        setShowToast(true);
        setShowModal(false);
        setTemplateForm({ name: '', subject: '', body: '', type: 'custom', variables: [], isDefault: false });
        setEditingId(null);
    };

    const handleDeleteTemplate = (id: string) => {
        if (window.confirm('Delete this template?')) {
            setEmailTemplates(prev => prev.filter(t => t.id !== id));
            setToastMessage('Template deleted');
            setShowToast(true);
        }
    };

    const handleEditTemplate = (template: EmailTemplate) => {
        setTemplateForm(template);
        setEditingId(template.id);
        setShowModal(true);
    };

    const handleToggleRule = (id: string) => {
        setNotificationRules(prev =>
            prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
        );
        setToastMessage('Rule updated');
        setShowToast(true);
    };

    const handleSendTestEmail = (template: EmailTemplate) => {
        setToastMessage(`Test email sent for "${template.name}"`);
        setShowToast(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Email & Notifications</h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 font-medium border-b-2 transition-all ${
                        activeTab === 'templates'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Mail className="h-5 w-5 mr-2 inline" />
                    Email Templates
                </button>
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`px-4 py-2 font-medium border-b-2 transition-all ${
                        activeTab === 'rules'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Bell className="h-5 w-5 mr-2 inline" />
                    Notification Rules
                </button>
            </div>

            {/* Email Templates Tab */}
            {activeTab === 'templates' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setTemplateForm({ name: '', subject: '', body: '', type: 'custom', variables: [], isDefault: false });
                                setEditingId(null);
                                setShowModal(true);
                            }}
                            className="flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Template
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {emailTemplates.map(template => (
                            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center">
                                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                            {template.isDefault && (
                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Subject: {template.subject}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleSendTestEmail(template)}
                                            className="text-green-600 hover:text-green-900 p-1"
                                            title="Send test email"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEditTemplate(template)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 line-clamp-2">
                                    {template.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notification Rules Tab */}
            {activeTab === 'rules' && (
                <div>
                    <div className="space-y-3">
                        {notificationRules.map(rule => (
                            <div key={rule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            Event: <span className="font-medium">{rule.event}</span> | 
                                            Frequency: <span className="font-medium">{rule.frequency}</span>
                                        </p>
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rule.enabled}
                                            onChange={() => handleToggleRule(rule.id)}
                                            className="h-4 w-4"
                                        />
                                        <span className={`ml-2 text-sm font-medium ${rule.enabled ? 'text-green-600' : 'text-gray-600'}`}>
                                            {rule.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Template Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingId ? 'Edit Template' : 'Create Template'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                        <input
                            type="text"
                            value={templateForm.name || ''}
                            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Invoice Sent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            value={templateForm.subject || ''}
                            onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Your Invoice #{invoice_number}"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                        <textarea
                            value={templateForm.body || ''}
                            onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={8}
                            placeholder="Use {variable_name} for placeholders"
                        />
                        <p className="text-xs text-gray-600 mt-1">Available variables: {'{client_name}, {invoice_number}, {amount}, {due_date}'}</p>
                    </div>

                    <div className="flex space-x-2">
                        <Button variant="primary" onClick={handleSaveTemplate} className="flex-1">
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            <Toast
                message={toastMessage}
                type="info"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default EmailNotificationSystem;
