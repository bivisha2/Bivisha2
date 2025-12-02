'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Send,
    Calendar,
    User,
    Building,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    AlertCircle,
    X,
    FileText,
    Download
} from 'lucide-react';
import Button from '@/components/Button';
import Breadcrumb from '@/components/Breadcrumb';
import { createInvoice, generateInvoiceNumber } from '@/services/invoiceService';
import { downloadInvoicePDF, sendInvoiceEmail } from '@/utils/invoiceHelpers';
import type { Invoice, RecurringFrequency } from '@/types/invoice';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface ClientInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
}

export default function NewInvoice() {
    const router = useRouter();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('none');

    // Invoice basic info
    const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [status, setStatus] = useState<'draft' | 'pending' | 'paid' | 'overdue'>('draft');

    // Client information
    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    });

    // Invoice items
    const [items, setItems] = useState<InvoiceItem[]>([
        {
            id: '1',
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        }
    ]);

    // Invoice notes and terms
    const [notes, setNotes] = useState('');
    const [terms, setTerms] = useState('Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge.');

    // Tax and discount
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);

    const breadcrumbItems = [
        { label: 'Invoices', href: '/invoices' },
        { label: 'New Invoice' }
    ];

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // Recalculate amount when quantity or rate changes (but not when amount is directly set)
                if (field === 'quantity' || field === 'rate') {
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                }
                // When amount is directly changed, update rate to match (quantity = 1)
                if (field === 'amount') {
                    updatedItem.rate = updatedItem.amount;
                    updatedItem.quantity = 1;
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
        setClientInfo(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (isDraft: boolean = false) => {
        // For drafts, we don't require validation - allow saving incomplete forms
        if (isDraft) {
            return true;
        }

        // For sending invoice, we need full validation
        if (!clientInfo.name || !clientInfo.email) {
            setToastMessage('Please fill in client name and email');
            setToastType('error');
            setShowToast(true);
            return false;
        }

        if (items.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
            setToastMessage('Please fill in all item details');
            setToastType('error');
            setShowToast(true);
            return false;
        }

        return true;
    };

    const handleSaveDraft = () => {
        try {
            // Create invoice object - no validation required for drafts
            const invoiceData = {
                issueDate,
                dueDate,
                status: 'draft' as const,
                client: {
                    name: clientInfo.name || 'Draft Client',
                    email: clientInfo.email || '',
                    phone: clientInfo.phone || '',
                    address: clientInfo.address || '',
                    company: clientInfo.company || ''
                },
                items: items.length > 0 ? items : [{
                    id: '1',
                    description: '',
                    quantity: 1,
                    rate: 0,
                    amount: 0
                }],
                subtotal,
                taxRate,
                taxAmount,
                discount,
                discountAmount,
                total,
                notes,
                terms,
                template: selectedTemplate,
                recurring: recurringFrequency
            };

            // Save to database
            const savedInvoice = createInvoice(invoiceData);

            setToastMessage(`Invoice ${savedInvoice.invoiceNumber} saved as draft successfully!`);
            setToastType('success');
            setShowToast(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/invoices');
            }, 1500);
        } catch (error) {
            console.error('Error saving draft:', error);
            setToastMessage('Error saving draft. Please try again.');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleSend = async () => {
        // Validate form before sending
        if (!validateForm(false)) return;

        // Confirm with user before sending
        const confirmSend = window.confirm(
            `Send invoice to:\n\n` +
            `Client: ${clientInfo.name}\n` +
            `Email: ${clientInfo.email}\n\n` +
            `This will:\n` +
            `1. Open Gmail to send the invoice\n` +
            `2. Mark the invoice as "Sent"\n\n` +
            `Do you want to continue?`
        );

        if (!confirmSend) {
            return;
        }

        try {
            // First, send the email via Gmail
            const emailData = {
                invoiceNumber,
                clientName: clientInfo.name,
                clientEmail: clientInfo.email,
                amount: total,
                dueDate,
                issueDate,
                items: items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    price: item.rate,
                    total: item.amount
                })),
                subtotal,
                tax: taxAmount,
                notes
            };

            const emailSent = await sendInvoiceEmail(emailData);

            if (!emailSent) {
                setToastMessage('Failed to open email client. Please try again.');
                setToastType('error');
                setShowToast(true);
                return;
            }

            // Then save to database with 'sent' status
            const invoiceData = {
                issueDate,
                dueDate,
                status: 'sent' as const,
                client: {
                    name: clientInfo.name,
                    email: clientInfo.email,
                    phone: clientInfo.phone,
                    address: clientInfo.address,
                    company: clientInfo.company
                },
                items,
                subtotal,
                taxRate,
                taxAmount,
                discount,
                discountAmount,
                total,
                notes,
                terms,
                template: selectedTemplate,
                recurring: recurringFrequency
            };

            // Save to database with 'sent' status
            const savedInvoice = createInvoice(invoiceData);

            setToastMessage(`Gmail opened! Invoice ${savedInvoice.invoiceNumber} will be marked as sent after you send the email.`);
            setToastType('success');
            setShowToast(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/invoices');
            }, 2500);
        } catch (error) {
            console.error('Error sending invoice:', error);
            setToastMessage('Error sending invoice. Please try again.');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Generate filename with invoice number or timestamp
            const fileName = `invoice-${invoiceNumber || Date.now()}.pdf`;
            
            // Show loading message
            setToastMessage('Generating PDF... Please wait...');
            setToastType('success');
            setShowToast(true);

            // Small delay to ensure the toast is visible and DOM is ready
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('Starting PDF download...');
            const success = await downloadInvoicePDF('invoice-content', fileName);
        
            if (success) {
                setToastMessage(`PDF downloaded successfully: ${fileName}`);
                setToastType('success');
                setShowToast(true);
            } else {
                setToastMessage('Failed to generate PDF. Please check console for errors.');
                setToastType('error');
                setShowToast(true);
            }
        } catch (error) {
            console.error('PDF download error:', error);
            setToastMessage(`Error: ${error instanceof Error ? error.message : 'Failed to download PDF'}`);
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleSendEmail = async () => {
        if (!validateForm(false)) {
            return;
        }

        const invoiceData = {
            invoiceNumber,
            clientName: clientInfo.name,
            clientEmail: clientInfo.email,
            amount: total,
            dueDate,
            issueDate,
            items: items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.rate,
                total: item.amount
            })),
            subtotal,
            tax: taxAmount,
            notes
        };

        const success = await sendInvoiceEmail(invoiceData);
        if (success) {
            setToastMessage('Gmail opened with invoice details!');
            setToastType('success');
            setShowToast(true);
        } else {
            setToastMessage('Failed to open email. Please try again.');
            setToastType('error');
            setShowToast(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div data-hide-in-pdf>
                    <Breadcrumb items={breadcrumbItems} className="mb-4" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8" data-hide-in-pdf>
                    <div className="flex items-center">
                        <Link href="/invoices" className="mr-4">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
                            <p className="text-gray-600 mt-1">Fill in the details to generate your invoice</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="outline" onClick={handleSendEmail}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                        </Button>
                        <Button variant="outline" onClick={handleSaveDraft}>
                            <Save className="h-4 w-4 mr-2" />
                            Save as Draft
                        </Button>
                        <Button variant="primary" onClick={handleSend}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Invoice
                        </Button>
                    </div>
                </div>

                {/* Invoice Form - Professional Layout */}
                <div id="invoice-content" ref={invoiceRef} className="bg-white rounded-lg shadow-lg border border-gray-200">
                    {/* Invoice Header with Blue Background */}
                    <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8" />
                                <h1 className="text-2xl font-bold">InvoicePro</h1>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold">Tax Invoice</h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Company and Invoice Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Company Info */}
                            <div className="space-y-1">
                                <div className="font-bold text-lg text-gray-900">InvoicePro</div>
                                <div className="text-gray-700">123 Business Street, Suite 100</div>
                                <div className="text-gray-700">San Francisco, CA 94102</div>
                                <div className="text-gray-700">Tel: +1 (555) 123-4567</div>
                                <div className="text-gray-700">Email: contact@invoicepro.com</div>
                                <div className="text-gray-700">Reg No: 12345678</div>
                                <div className="text-gray-700">VATIN: 123456789</div>
                            </div>

                            {/* Invoice Details */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Invoice No.
                                        </label>
                                        <input
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Invoice Date
                                        </label>
                                        <input
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Total Amount
                                    </label>
                                    <div className="text-xl font-bold text-gray-900">Rs. {total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Client and Address Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Client Information */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-300">Client</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={clientInfo.name}
                                        onChange={(e) => handleClientInfoChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                        placeholder="Client Name"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={clientInfo.company}
                                        onChange={(e) => handleClientInfoChange('company', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                        placeholder="Company Name"
                                    />
                                    <input
                                        type="email"
                                        value={clientInfo.email}
                                        onChange={(e) => handleClientInfoChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                        placeholder="Email Address"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        value={clientInfo.phone}
                                        onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            {/* Address and VATIN */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-300">Address</h3>
                                <div className="space-y-3">
                                    <textarea
                                        value={clientInfo.address}
                                        onChange={(e) => handleClientInfoChange('address', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                        rows={6}
                                        placeholder="Client Address"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">VATIN</h4>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                            placeholder="N/A"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Items Table */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4" data-hide-in-pdf>
                                <Button variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Item
                                </Button>
                            </div>

                            <div className="border-2 border-gray-300 rounded">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-300 w-12">
                                                Sn.
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900 border-r border-gray-300">
                                                Service/Product Description
                                            </th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-900 w-32">
                                                Charge in Rs.
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 w-16" data-hide-in-pdf>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-300">
                                                <td className="py-3 px-4 border-r border-gray-300 text-center font-semibold">
                                                    {index + 1}.
                                                </td>
                                                <td className="py-3 px-4 border-r border-gray-300">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                                        placeholder="Enter service/product description"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.amount === 0 ? '' : item.amount}
                                                        onChange={(e) => {
                                                            const amount = parseFloat(e.target.value) || 0;
                                                            updateItem(item.id, 'amount', amount);
                                                        }}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white text-right"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center" data-hide-in-pdf>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={items.length === 1}
                                                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Total in Words and Invoice Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Total in Words */}
                            <div>
                                <div className="font-semibold text-gray-900 mb-2">Total in words:</div>
                                <div className="border-2 border-gray-300 rounded p-3 min-h-20 bg-gray-50">
                                    <span className="text-gray-700 font-medium">
                                        {total === 0 ? 'Zero' : `${total.toFixed(2)} Rupees Only`}
                                    </span>
                                </div>
                            </div>

                            {/* Invoice Totals */}
                            <div>
                                <div className="border-2 border-gray-300 rounded">
                                    <div className="space-y-0">
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
                                            <span className="font-semibold text-gray-900">Subtotal</span>
                                            <span className="font-semibold text-gray-900">{subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-900">VAT</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={taxRate}
                                                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                                    className="w-12 px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-black font-semibold bg-white"
                                                />
                                                <span className="text-gray-900 text-sm">%</span>
                                            </div>
                                            <span className="font-semibold text-gray-900">{taxAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center px-4 py-3 bg-gray-100">
                                            <span className="font-bold text-gray-900 text-lg">Total</span>
                                            <span className="font-bold text-gray-900 text-lg">{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="text-center">
                                <div className="border-2 border-gray-300 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-400 text-xs">Signature</span>
                                </div>
                                <div className="border-b-2 border-gray-300 pb-1">
                                    <span className="font-semibold text-gray-900">For InvoicePro</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="border-2 border-gray-300 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-400 text-xs">Company Seal</span>
                                </div>
                                <div className="border-b-2 border-gray-300 pb-1">
                                    <span className="font-semibold text-gray-900">Authorized Signature</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact and Notes */}
                        <div className="text-center mb-8">
                            <div className="text-blue-600 font-semibold">invoicepro.com</div>
                        </div>

                        {/* Additional Notes Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                    rows={4}
                                    placeholder="Additional notes for your client..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Terms & Conditions
                                </label>
                                <textarea
                                    value={terms}
                                    onChange={(e) => setTerms(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold bg-white"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-4 mt-8 pb-8" data-hide-in-pdf>
                    <Link href="/invoices">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button variant="success" onClick={handleDownloadPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button variant="outline" onClick={handleSaveDraft}>
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                    </Button>
                    <Button variant="primary" onClick={handleSend}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Invoice
                    </Button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50">
                    <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border ${toastType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}>
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    {toastType === 'success' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{toastMessage}</p>
                                </div>
                                <div className="ml-4 shrink-0 flex">
                                    <button
                                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                                        onClick={() => setShowToast(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}