'use client';

import React, { useState } from 'react';
import { FileText, Layout, Eye, Save, Trash2, Plus, Check, Grid3x3 } from 'lucide-react';

interface InvoiceTemplate {
    id: string;
    name: string;
    description: string;
    layout: 'classic' | 'modern' | 'minimal' | 'professional' | 'creative';
    colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    headerStyle: 'centered' | 'left' | 'split' | 'banner';
    footerText: string;
    logoPosition: 'left' | 'center' | 'right';
    showCompanyDetails: boolean;
    showPaymentTerms: boolean;
    showNotes: boolean;
    itemTableStyle: 'standard' | 'compact' | 'detailed' | 'grid';
    fontFamily: 'inter' | 'roboto' | 'poppins' | 'montserrat';
    isDefault: boolean;
    createdAt: string;
}

interface InvoiceTemplateManagerProps {
    onSelectTemplate?: (template: InvoiceTemplate) => void;
    currentTemplateId?: string;
}

const InvoiceTemplateManager: React.FC<InvoiceTemplateManagerProps> = ({
    onSelectTemplate,
    currentTemplateId,
}) => {
    const [templates, setTemplates] = useState<InvoiceTemplate[]>([
        {
            id: 'template-1',
            name: 'Classic Business',
            description: 'Traditional invoice layout with clear sections and professional styling',
            layout: 'classic',
            colorScheme: {
                primary: '#1e40af',
                secondary: '#64748b',
                accent: '#3b82f6',
            },
            headerStyle: 'left',
            footerText: 'Thank you for your business!',
            logoPosition: 'left',
            showCompanyDetails: true,
            showPaymentTerms: true,
            showNotes: true,
            itemTableStyle: 'standard',
            fontFamily: 'inter',
            isDefault: true,
            createdAt: '2025-11-11T08:00:00Z',
        },
        {
            id: 'template-2',
            name: 'Modern Minimal',
            description: 'Clean and contemporary design with minimal visual clutter',
            layout: 'minimal',
            colorScheme: {
                primary: '#0f172a',
                secondary: '#94a3b8',
                accent: '#06b6d4',
            },
            headerStyle: 'centered',
            footerText: 'Questions? Contact us anytime.',
            logoPosition: 'center',
            showCompanyDetails: true,
            showPaymentTerms: true,
            showNotes: false,
            itemTableStyle: 'compact',
            fontFamily: 'poppins',
            isDefault: false,
            createdAt: '2025-11-11T08:15:00Z',
        },
        {
            id: 'template-3',
            name: 'Professional Corporate',
            description: 'Formal layout ideal for enterprise and B2B transactions',
            layout: 'professional',
            colorScheme: {
                primary: '#7c3aed',
                secondary: '#6b7280',
                accent: '#8b5cf6',
            },
            headerStyle: 'split',
            footerText: 'Payment terms: Net 30 days. Late payment subject to 1.5% monthly interest.',
            logoPosition: 'left',
            showCompanyDetails: true,
            showPaymentTerms: true,
            showNotes: true,
            itemTableStyle: 'detailed',
            fontFamily: 'roboto',
            isDefault: false,
            createdAt: '2025-11-11T08:30:00Z',
        },
        {
            id: 'template-4',
            name: 'Creative Studio',
            description: 'Bold and artistic design for creative agencies and freelancers',
            layout: 'creative',
            colorScheme: {
                primary: '#db2777',
                secondary: '#4b5563',
                accent: '#ec4899',
            },
            headerStyle: 'banner',
            footerText: 'Made with ❤️ by our team',
            logoPosition: 'center',
            showCompanyDetails: true,
            showPaymentTerms: false,
            showNotes: true,
            itemTableStyle: 'grid',
            fontFamily: 'montserrat',
            isDefault: false,
            createdAt: '2025-11-11T08:45:00Z',
        },
    ]);

    const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(
        templates.find((t) => t.id === currentTemplateId) || templates[0]
    );
    const [showPreview, setShowPreview] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    const handleSelectTemplate = (template: InvoiceTemplate) => {
        setSelectedTemplate(template);
        if (onSelectTemplate) {
            onSelectTemplate(template);
        }
    };

    const handleSetDefault = (templateId: string) => {
        setTemplates((prev) =>
            prev.map((t) => ({
                ...t,
                isDefault: t.id === templateId,
            }))
        );
    };

    const handleDeleteTemplate = (templateId: string) => {
        // Don't allow deleting the last template or default template
        const template = templates.find((t) => t.id === templateId);
        if (templates.length === 1 || template?.isDefault) {
            return;
        }

        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
        if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(templates[0]);
        }
    };

    const handleCreateNewTemplate = () => {
        if (!newTemplateName.trim()) return;

        const newTemplate: InvoiceTemplate = {
            id: `template-${Date.now()}`,
            name: newTemplateName,
            description: 'Custom template',
            layout: 'modern',
            colorScheme: {
                primary: '#3b82f6',
                secondary: '#64748b',
                accent: '#06b6d4',
            },
            headerStyle: 'left',
            footerText: 'Thank you for your business!',
            logoPosition: 'left',
            showCompanyDetails: true,
            showPaymentTerms: true,
            showNotes: true,
            itemTableStyle: 'standard',
            fontFamily: 'inter',
            isDefault: false,
            createdAt: new Date().toISOString(),
        };

        setTemplates((prev) => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate);
        setNewTemplateName('');
        setIsCreatingNew(false);
    };

    const getLayoutIcon = (layout: string) => {
        switch (layout) {
            case 'classic':
                return <FileText className="w-5 h-5" />;
            case 'minimal':
                return <Layout className="w-5 h-5" />;
            case 'professional':
                return <FileText className="w-5 h-5" />;
            case 'creative':
                return <Grid3x3 className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Customize your invoice appearance and branding
                    </p>
                </div>
                <button
                    onClick={() => setIsCreatingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Template
                </button>
            </div>

            {/* Create New Template Form */}
            {isCreatingNew && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Create New Template
                    </h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            placeholder="Template name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleCreateNewTemplate();
                            }}
                        />
                        <button
                            onClick={handleCreateNewTemplate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreatingNew(false);
                                setNewTemplateName('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg ${
                            selectedTemplate?.id === template.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectTemplate(template)}
                    >
                        {/* Template Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: template.colorScheme.primary + '15' }}
                            >
                                {getLayoutIcon(template.layout)}
                            </div>
                            {template.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Default
                                </span>
                            )}
                        </div>

                        {/* Template Info */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {template.description}
                        </p>

                        {/* Color Scheme Preview */}
                        <div className="flex gap-2 mb-4">
                            <div
                                className="w-8 h-8 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: template.colorScheme.primary }}
                                title="Primary Color"
                            />
                            <div
                                className="w-8 h-8 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: template.colorScheme.secondary }}
                                title="Secondary Color"
                            />
                            <div
                                className="w-8 h-8 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: template.colorScheme.accent }}
                                title="Accent Color"
                            />
                        </div>

                        {/* Template Features */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Layout: {template.layout}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Header: {template.headerStyle}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Font: {template.fontFamily}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTemplate(template);
                                    setShowPreview(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                            {!template.isDefault && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSetDefault(template.id);
                                        }}
                                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                        title="Set as default"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTemplate(template.id);
                                        }}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        title="Delete template"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {showPreview && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                Template Preview: {selectedTemplate.name}
                            </h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Invoice Preview */}
                            <div
                                className="bg-white shadow-lg rounded-lg p-8 border"
                                style={{
                                    fontFamily: selectedTemplate.fontFamily,
                                    borderColor: selectedTemplate.colorScheme.primary,
                                }}
                            >
                                {/* Header */}
                                <div
                                    className={`mb-8 pb-6 border-b-2 ${
                                        selectedTemplate.headerStyle === 'centered'
                                            ? 'text-center'
                                            : selectedTemplate.headerStyle === 'split'
                                            ? 'flex justify-between items-start'
                                            : 'flex justify-between items-start'
                                    }`}
                                    style={{ borderColor: selectedTemplate.colorScheme.primary }}
                                >
                                    <div>
                                        <h1
                                            className="text-4xl font-bold mb-2"
                                            style={{ color: selectedTemplate.colorScheme.primary }}
                                        >
                                            INVOICE
                                        </h1>
                                        {selectedTemplate.showCompanyDetails && (
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p className="font-semibold">Your Company Name</p>
                                                <p>123 Business St, Suite 100</p>
                                                <p>City, State 12345</p>
                                                <p>contact@company.com</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-semibold text-gray-900">Invoice #12345</p>
                                        <p className="text-gray-600">Date: Nov 11, 2025</p>
                                        <p className="text-gray-600">Due: Dec 11, 2025</p>
                                    </div>
                                </div>

                                {/* Bill To */}
                                <div className="mb-8">
                                    <h2
                                        className="text-lg font-bold mb-3"
                                        style={{ color: selectedTemplate.colorScheme.secondary }}
                                    >
                                        Bill To:
                                    </h2>
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold">Client Company</p>
                                        <p>456 Client Ave</p>
                                        <p>City, State 67890</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mb-8">
                                    <table className="w-full">
                                        <thead>
                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        selectedTemplate.colorScheme.primary + '15',
                                                }}
                                            >
                                                <th className="text-left p-3 font-semibold">
                                                    Description
                                                </th>
                                                <th className="text-right p-3 font-semibold">Qty</th>
                                                <th className="text-right p-3 font-semibold">
                                                    Rate
                                                </th>
                                                <th className="text-right p-3 font-semibold">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-200">
                                                <td className="p-3">Web Development Services</td>
                                                <td className="text-right p-3">40</td>
                                                <td className="text-right p-3">Rs. 5,000</td>
                                                <td className="text-right p-3">Rs. 200,000</td>
                                            </tr>
                                            <tr className="border-b border-gray-200">
                                                <td className="p-3">Design Consultation</td>
                                                <td className="text-right p-3">10</td>
                                                <td className="text-right p-3">Rs. 3,000</td>
                                                <td className="text-right p-3">Rs. 30,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Total */}
                                <div className="flex justify-end mb-8">
                                    <div className="w-64">
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-semibold">Rs. 230,000</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Tax (13%):</span>
                                            <span className="font-semibold">Rs. 29,900</span>
                                        </div>
                                        <div
                                            className="flex justify-between py-3 text-lg font-bold"
                                            style={{ color: selectedTemplate.colorScheme.primary }}
                                        >
                                            <span>Total:</span>
                                            <span>Rs. 259,900</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Terms */}
                                {selectedTemplate.showPaymentTerms && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Payment Terms
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Payment is due within 30 days. Please include invoice
                                            number with payment.
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedTemplate.showNotes && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                                        <p className="text-sm text-gray-600">
                                            Thank you for choosing our services. We appreciate your
                                            business!
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div
                                    className="text-center pt-6 border-t-2 text-sm"
                                    style={{
                                        borderColor: selectedTemplate.colorScheme.primary,
                                        color: selectedTemplate.colorScheme.secondary,
                                    }}
                                >
                                    {selectedTemplate.footerText}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceTemplateManager;
