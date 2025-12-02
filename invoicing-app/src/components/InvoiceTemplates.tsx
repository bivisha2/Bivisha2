'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';
import Toast from './Toast';

interface InvoiceTemplate {
    id: string;
    name: string;
    description: string;
    defaultTax: number;
    defaultCurrency: string;
    terms: string;
    notes: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
    isDefault: boolean;
    createdAt: string;
}

const InvoiceTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<InvoiceTemplate[]>([
        {
            id: '1',
            name: 'Standard Service Invoice',
            description: 'General service invoice template',
            defaultTax: 10,
            defaultCurrency: 'USD',
            terms: 'Net 30',
            notes: 'Thank you for your business!',
            items: [{ description: 'Service', quantity: 1, price: 0 }],
            isDefault: true,
            createdAt: '2025-01-01'
        },
        {
            id: '2',
            name: 'Subscription Template',
            description: 'Monthly subscription invoicing',
            defaultTax: 8,
            defaultCurrency: 'USD',
            terms: 'Due upon receipt',
            notes: 'Monthly subscription renewal',
            items: [{ description: 'Monthly subscription', quantity: 1, price: 0 }],
            isDefault: false,
            createdAt: '2025-01-15'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState<Partial<InvoiceTemplate>>({
        name: '',
        description: '',
        defaultTax: 0,
        defaultCurrency: 'USD',
        terms: 'Net 30',
        notes: '',
        items: [{ description: '', quantity: 1, price: 0 }]
    });

    const handleCreateOrUpdate = () => {
        if (!formData.name || !formData.description) {
            setToastMessage('Please fill in required fields');
            setToastType('error');
            setShowToast(true);
            return;
        }

        if (editingId) {
            setTemplates(prev =>
                prev.map(t =>
                    t.id === editingId
                        ? { ...t, ...formData as Partial<InvoiceTemplate> }
                        : t
                )
            );
            setToastMessage('Template updated successfully');
        } else {
            const newTemplate: InvoiceTemplate = {
                id: Date.now().toString(),
                name: formData.name || '',
                description: formData.description || '',
                defaultTax: formData.defaultTax || 0,
                defaultCurrency: formData.defaultCurrency || 'USD',
                terms: formData.terms || 'Net 30',
                notes: formData.notes || '',
                items: formData.items || [{ description: '', quantity: 1, price: 0 }],
                isDefault: false,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setTemplates([...templates, newTemplate]);
            setToastMessage('Template created successfully');
        }

        setToastType('success');
        setShowToast(true);
        setShowModal(false);
        resetForm();
    };

    const handleSetDefault = (id: string) => {
        setTemplates(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, isDefault: true }
                    : { ...t, isDefault: false }
            )
        );
        setToastMessage('Default template updated');
        setToastType('info');
        setShowToast(true);
    };

    const handleDuplicate = (template: InvoiceTemplate) => {
        const duplicated: InvoiceTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (Copy)`,
            isDefault: false,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setTemplates([...templates, duplicated]);
        setToastMessage('Template duplicated successfully');
        setToastType('success');
        setShowToast(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this template?')) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            setToastMessage('Template deleted');
            setToastType('info');
            setShowToast(true);
        }
    };

    const handleEdit = (template: InvoiceTemplate) => {
        setFormData(template);
        setEditingId(template.id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            defaultTax: 0,
            defaultCurrency: 'USD',
            terms: 'Net 30',
            notes: '',
            items: [{ description: '', quantity: 1, price: 0 }]
        });
        setEditingId(null);
    };

    const previewTemplate = templates.find(t => t.id === previewId);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                    <div
                        key={template.id}
                        className={`rounded-lg border-2 p-4 transition-all ${
                            template.isDefault
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{template.name}</h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            {template.isDefault && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded ml-2">
                                    Default
                                </span>
                            )}
                        </div>

                        <div className="mb-3 space-y-1 text-sm text-gray-600">
                            <p>Tax: {template.defaultTax}%</p>
                            <p>Terms: {template.terms}</p>
                            <p>Currency: {template.defaultCurrency}</p>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setPreviewId(template.id);
                                    setShowPreview(true);
                                }}
                                className="flex-1 text-blue-600 hover:text-blue-900 py-1 text-sm font-medium flex items-center justify-center"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                            </button>
                            <button
                                onClick={() => handleEdit(template)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDuplicate(template)}
                                className="text-green-600 hover:text-green-900 p-1"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(template.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {!template.isDefault && (
                            <button
                                onClick={() => handleSetDefault(template.id)}
                                className="w-full mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
                            >
                                Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
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
                            placeholder="e.g., Standard Invoice"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            placeholder="What is this template used for?"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax %</label>
                            <input
                                type="number"
                                value={formData.defaultTax || 0}
                                onChange={(e) => setFormData({ ...formData, defaultTax: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                value={formData.defaultCurrency || 'USD'}
                                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
                            <input
                                type="text"
                                value={formData.terms || 'Net 30'}
                                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            placeholder="Default notes to include on invoices"
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <Button variant="primary" onClick={handleCreateOrUpdate} className="flex-1">
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Preview Modal */}
            {previewTemplate && (
                <Modal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    title={`Preview: ${previewTemplate.name}`}
                >
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="font-medium">{previewTemplate.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tax Rate</p>
                                <p className="font-medium">{previewTemplate.defaultTax}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Currency</p>
                                <p className="font-medium">{previewTemplate.defaultCurrency}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="font-medium">{previewTemplate.terms}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="font-medium">{previewTemplate.notes || 'No notes'}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(false)}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </div>
                </Modal>
            )}

            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default InvoiceTemplates;
