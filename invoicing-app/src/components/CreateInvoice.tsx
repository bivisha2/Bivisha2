'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import InvoiceView from './InvoiceView';
import { downloadInvoicePDF, sendInvoiceEmail } from '@/utils/invoiceHelpers';

interface InvoiceItem {
  description: string;
  details?: string;
  amount: number;
}

interface InvoiceFormData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyVATIN: string;
  clientName: string;
  clientAddress: string;
  clientVATIN: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  vatRate: number;
  notes: string;
}

const initialFormData: InvoiceFormData = {
  companyName: 'CURL LABS PVT. LTD.',
  companyAddress: 'Suryavinayak 5, Bhaktapur',
  companyPhone: '+977 9841027948',
  companyEmail: 'info@curllabs.com',
  companyVATIN: '606614186',
  clientName: '',
  clientAddress: '',
  clientVATIN: '',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ description: '', details: '', amount: 0 }],
  vatRate: 13,
  notes: ''
};

// Common input styles for better visibility
const inputStyles = "w-full border border-gray-400 rounded px-2 py-1 text-black text-xs font-semibold focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white";
const textareaStyles = "w-full border border-gray-400 rounded px-2 py-1 text-black text-xs font-semibold focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white resize-none";

function convertNumberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Million', 'Billion'];

  if (num === 0) return 'Zero';

  function convertHundreds(n: number): string {
    let result = '';

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }

    if (n > 0) {
      result += ones[n] + ' ';
    }

    return result;
  }

  let result = '';
  let thousandCounter = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      result = convertHundreds(num % 1000) + thousands[thousandCounter] + ' ' + result;
    }
    num = Math.floor(num / 1000);
    thousandCounter++;
  }

  return result.trim() + ' Only';
}

export default function CreateInvoice() {
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);

  const updateFormData = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', details: '', amount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const vatAmount = (subtotal * formData.vatRate) / 100;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `INV-${timestamp}${random}`;
  };

  const handleSave = () => {
    // Here you would typically save to a database
    console.log('Saving invoice:', formData);
    alert('Invoice saved successfully!');
  };

  const handleDownloadPDF = async () => {
    const fileName = `invoice-${formData.invoiceNumber || 'draft'}.pdf`;
    const success = await downloadInvoicePDF('invoice-preview', fileName);
    if (success) {
      alert('Invoice PDF downloaded successfully!');
    } else {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSendEmail = async () => {
    if (!formData.clientName) {
      alert('Please enter client name');
      return;
    }

    // Extract email from client address or use a default
    const clientEmail = formData.clientAddress.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '';

    if (!clientEmail) {
      alert('Please include client email in the address field');
      return;
    }

    const invoiceData = {
      invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
      clientName: formData.clientName,
      clientEmail: clientEmail,
      amount: total,
      dueDate: formData.dueDate,
      issueDate: formData.invoiceDate,
      notes: formData.notes
    };

    const success = await sendInvoiceEmail(invoiceData);
    if (success) {
      alert('Gmail compose window opened with invoice details!');
    } else {
      alert('Failed to open email client. Please try again.');
    }
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  const invoiceData = {
    ...formData,
    subtotal,
    vatAmount,
    total,
    totalInWords: convertNumberToWords(total),
    invoiceNumber: formData.invoiceNumber || generateInvoiceNumber()
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Edit
            </button>
          </div>
          <div id="invoice-preview">
            <InvoiceView
              invoice={invoiceData}
              onEdit={() => setShowPreview(false)}
              onDownload={handleDownloadPDF}
              onPrint={() => window.print()}
              onSend={handleSendEmail}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-black">InvoicePro - Professional Invoicing Solution</h1>
          </div>

          <form className="space-y-4">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-black">Company Information</h2>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Address</label>
                  <textarea
                    value={formData.companyAddress}
                    onChange={(e) => updateFormData('companyAddress', e.target.value)}
                    rows={3}
                    className={textareaStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.companyPhone}
                    onChange={(e) => updateFormData('companyPhone', e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => updateFormData('companyEmail', e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">VATIN</label>
                  <input
                    type="text"
                    value={formData.companyVATIN}
                    onChange={(e) => updateFormData('companyVATIN', e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-black">Client Information</h2>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Client Name</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => updateFormData('clientName', e.target.value)}
                    className={inputStyles}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Client Address</label>
                  <textarea
                    value={formData.clientAddress}
                    onChange={(e) => updateFormData('clientAddress', e.target.value)}
                    rows={3}
                    className={textareaStyles}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Client VATIN (Optional)</label>
                  <input
                    type="text"
                    value={formData.clientVATIN}
                    onChange={(e) => updateFormData('clientVATIN', e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) => updateFormData('invoiceDate', e.target.value)}
                      className={inputStyles}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">Due Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => updateFormData('dueDate', e.target.value)}
                      className={inputStyles}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black mb-1">Invoice Number (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
                    placeholder={generateInvoiceNumber()}
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold text-black">Invoice Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add Item
                </button>
              </div>

              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-start p-2 border border-gray-300 rounded">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-black mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className={inputStyles}
                        required
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-black mb-1">Details (Optional)</label>
                      <input
                        type="text"
                        value={item.details || ''}
                        onChange={(e) => updateItem(index, 'details', e.target.value)}
                        className={inputStyles}
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-black mb-1">Amount (Rs.)</label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                        className={inputStyles}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="col-span-1 flex justify-center pt-5">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Settings and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-black mb-1">VAT Rate (%)</label>
                <input
                  type="number"
                  value={formData.vatRate}
                  onChange={(e) => updateFormData('vatRate', parseFloat(e.target.value) || 0)}
                  className={inputStyles}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  rows={3}
                  className={textareaStyles}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-3 rounded border">
              <h3 className="text-sm font-semibold text-black mb-2">Invoice Summary</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal:</span>
                  <span className="font-bold text-black">Rs. {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">VAT ({formData.vatRate}%):</span>
                  <span className="font-bold text-black">Rs. {vatAmount.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span className="text-black">Total:</span>
                  <span className="text-black">Rs. {total.toLocaleString()}.00</span>
                </div>
                <div className="text-xs text-black italic">
                  In words: {convertNumberToWords(total)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs"
              >
                <Save className="h-3 w-3" />
                Save Invoice
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
              >
                <Eye className="h-3 w-3" />
                Preview Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}