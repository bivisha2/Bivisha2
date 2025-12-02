'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export default function EditInvoice() {
    const router = useRouter();
    const params = useParams();
    const invoiceId = params.id as string;
    const invoiceRef = useRef<HTMLDivElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // Invoice basic info
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'draft' | 'sent' | 'paid' | 'overdue'>('draft');

    // Client information
    const [clientId, setClientId] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientCompany, setClientCompany] = useState('');

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
    const [terms, setTerms] = useState('Payment is due within 30 days of invoice date.');

    // Tax and discount
    const [taxRate, setTaxRate] = useState(0);

    const breadcrumbItems = [
        { label: 'Invoices', href: '/invoices' },
        { label: 'Edit Invoice' }
    ];

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    // Fetch invoice data
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`/api/invoices/${invoiceId}`);
                if (!response.ok) {
                    throw new Error('Invoice not found');
                }
                
                const data = await response.json();
                
                // Set invoice data
                setInvoiceNumber(data.invoiceNumber);
                setIssueDate(new Date(data.issueDate).toISOString().split('T')[0]);
                setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
                setStatus(data.status);
                setTaxRate(data.taxRate || 0);
                setNotes(data.notes || '');
                setTerms(data.terms || 'Payment is due within 30 days of invoice date.');
                
                // Set client data
                if (data.client) {
                    setClientId(data.client.id);
                    setClientName(data.client.name);
                    setClientEmail(data.client.email || '');
                    setClientPhone(data.client.phone || '');
                    setClientCompany(data.client.company || '');
                }
                
                // Set items
                if (data.items && data.items.length > 0) {
                    setItems(data.items.map((item: any) => ({
                        id: item.id,
                        description: item.description,
                        quantity: item.quantity,
                        rate: item.rate,
                        amount: item.quantity * item.rate
                    })));
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching invoice:', error);
                showToastMessage('Failed to load invoice', 'error');
                setLoading(false);
                setTimeout(() => router.push('/invoices'), 2000);
            }
        };

        fetchInvoice();
    }, [invoiceId, router]);

    const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

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
                if (field === 'quantity' || field === 'rate') {
                    updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const handleSaveInvoice = async () => {
        try {
            // Validation
            if (!clientName.trim()) {
                showToastMessage('Please enter client name', 'error');
                return;
            }

            if (items.some(item => !item.description.trim())) {
                showToastMessage('Please fill in all item descriptions', 'error');
                return;
            }

            const invoiceData = {
                invoiceNumber,
                clientId,
                issueDate: new Date(issueDate),
                dueDate: new Date(dueDate),
                status,
                subtotal,
                taxRate,
                taxAmount,
                total,
                notes,
                terms,
                items: items.map(({ id, ...item }) => item)
            };

            const response = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData)
            });

            if (!response.ok) {
                throw new Error('Failed to update invoice');
            }

            showToastMessage('Invoice updated successfully!', 'success');
            setTimeout(() => router.push('/invoices'), 1500);
        } catch (error) {
            console.error('Error updating invoice:', error);
            showToastMessage('Failed to update invoice', 'error');
        }
    };

    const handleDownloadPDF = () => {
        try {
            const invoiceContent = document.getElementById('invoice-content');
            if (!invoiceContent) {
                alert('Invoice content not found');
                return;
            }

            const printWindow = window.open('', '', 'width=800,height=600');
            if (!printWindow) {
                alert('Please allow popups to download PDF');
                return;
            }

            const styles = `
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    [data-hide-in-pdf] { display: none !important; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f3f4f6; font-weight: bold; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    @media print {
                        body { padding: 20px; }
                        [data-hide-in-pdf] { display: none !important; }
                    }
                </style>
            `;

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice ${invoiceNumber}</title>
                    ${styles}
                </head>
                <body>
                    ${invoiceContent.innerHTML}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }, 250);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div data-hide-in-pdf>
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Toast Notification */}
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
                        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                        {toastType === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Invoice</h1>
                            <p className="text-gray-600 mt-1">Update invoice details</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="success" onClick={handleSaveInvoice}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Invoice Form */}
                <div id="invoice-content" ref={invoiceRef} className="bg-white rounded-lg shadow-lg border border-gray-200">
                    {/* Invoice Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
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
                        {/* Company and Invoice Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Company Info */}
                            <div className="space-y-1">
                                <div className="font-bold text-lg text-gray-900">InvoicePro</div>
                                <div className="text-gray-700">123 Business Street, Suite 100</div>
                                <div className="text-gray-700">San Francisco, CA 94102</div>
                                <div className="text-gray-700">Tel: +1 (555) 123-4567</div>
                                <div className="text-gray-700">Email: contact@invoicepro.com</div>
                            </div>

                            {/* Invoice Details */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold">Invoice No:</span>
                                    <input
                                        type="text"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                        data-hide-in-pdf-input
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold">Issue Date:</span>
                                    <input
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold">Due Date:</span>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold">Status:</span>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Bill To Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Bill To:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Client Name"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                />
                                <input
                                    type="email"
                                    placeholder="Client Email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={clientCompany}
                                    onChange={(e) => setClientCompany(e.target.value)}
                                    className="px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white"
                                />
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4" data-hide-in-pdf>
                                <h3 className="text-lg font-bold text-gray-900">Items</h3>
                                <Button variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border-2 border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900 border border-gray-300">Description</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 w-24 border border-gray-300">Qty</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-900 w-32 border border-gray-300">Rate</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-900 w-32 border border-gray-300">Amount</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 w-16 border border-gray-300" data-hide-in-pdf>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-300">
                                                <td className="py-3 px-4 border border-gray-300">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-black font-semibold bg-white"
                                                        placeholder="Item description"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-center border border-gray-300">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-center text-black font-semibold bg-white"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-right border border-gray-300">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.rate}
                                                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right text-black font-semibold bg-white"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-right border border-gray-300">
                                                    <span className="font-semibold text-gray-900">
                                                        Rs. {item.amount.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center border border-gray-300" data-hide-in-pdf>
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

                        {/* Totals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="font-semibold text-gray-900 mb-2">Total in words:</div>
                                <div className="border-2 border-gray-300 rounded p-3 min-h-20 bg-gray-50">
                                    <span className="text-gray-700 font-medium">
                                        {total === 0 ? 'Zero' : `${total.toFixed(2)} Rupees Only`}
                                    </span>
                                </div>
                            </div>

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

                        {/* Signature and Stamp Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="text-center">
                                <div className="border-2 border-gray-300 rounded h-24 mx-auto mb-3 flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-400 text-xs">Customer Signature</span>
                                </div>
                                <div className="border-t-2 border-gray-900 pt-2">
                                    <span className="font-semibold text-gray-900 text-sm">Customer Sign</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="border-2 border-dashed border-blue-400 rounded-lg h-24 mx-auto mb-3 flex flex-col items-center justify-center bg-blue-50 relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <Building className="w-16 h-16 text-blue-600" />
                                    </div>
                                    <span className="text-blue-600 text-xs font-semibold mb-1 relative z-10">COMPANY STAMP</span>
                                    <span className="text-gray-400 text-xs relative z-10">Place stamp here</span>
                                </div>
                                <div className="pt-2">
                                    <span className="font-semibold text-blue-900 text-sm">Official Stamp</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="border-2 border-gray-300 rounded h-24 mx-auto mb-3 flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-400 text-xs">Authorized Signature</span>
                                </div>
                                <div className="border-t-2 border-gray-900 pt-2">
                                    <span className="font-semibold text-gray-900 text-sm">For InvoicePro</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                    rows={4}
                                    placeholder="Additional notes..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Terms & Conditions
                                </label>
                                <textarea
                                    value={terms}
                                    onChange={(e) => setTerms(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold bg-white placeholder-gray-400"
                                    rows={4}
                                    placeholder="Terms and conditions..."
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
                    <Button variant="success" onClick={handleSaveInvoice}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
