'use client';

import React from 'react';
import { Download, Printer, Send, Edit3 } from 'lucide-react';

interface InvoiceItem {
  description: string;
  details?: string;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyVATIN: string;
  clientName: string;
  clientAddress: string;
  clientVATIN?: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  totalInWords: string;
  notes?: string;
}

interface InvoiceViewProps {
  invoice: InvoiceData;
  onEdit?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onSend?: () => void;
}

export default function InvoiceView({
  invoice,
  onEdit,
  onDownload,
  onPrint,
  onSend
}: InvoiceViewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 p-4 bg-gray-50 border-b print:hidden">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        )}
        {onSend && (
          <button
            onClick={onSend}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        )}
      </div>

      {/* Invoice Content */}
      <div className="p-8 text-black print:text-black">
        <style jsx global>{`
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            * {
              color: #000 !important;
              font-weight: bold !important;
            }
            table, th, td { 
              border-color: #000 !important; 
              border-width: 2px !important; 
            }
          }
        `}</style>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-black">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-black">{invoice.companyName}</h1>
                <p className="text-xs text-black">{invoice.companyAddress}</p>
                <p className="text-xs text-black">Tel: {invoice.companyPhone} Email: {invoice.companyEmail}</p>
                <p className="text-xs text-black">Reg No. 197160</p>
                <p className="text-xs text-black">VATIN {invoice.companyVATIN}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-black mb-2">Tax Invoice</h2>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-black">Invoice No.</span>
                  <span className="font-bold text-black">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-black">Invoice Date</span>
                  <span className="font-bold text-black">{invoice.invoiceDate}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-black">Total Amount</span>
                  <span className="font-bold text-black">Rs. {invoice.total.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-8 text-xs">
            <div>
              <span className="text-black">Client</span>
              <p className="font-bold text-black">{invoice.clientName}</p>
            </div>
            <div>
              <span className="text-black">Address</span>
              <p className="font-bold text-black">{invoice.clientAddress}</p>
            </div>
            <div>
              <span className="text-black">VATIN</span>
              <p className="font-bold text-black">{invoice.clientVATIN || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left py-2 px-2 text-xs font-bold text-black border-r border-black w-12">Sn.</th>
                <th className="text-left py-2 px-2 text-xs font-bold text-black border-r border-black">Service/Product Description</th>
                <th className="text-right py-2 px-2 text-xs font-bold text-black w-24">Charge In Rs.</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="py-2 px-2 align-top border-r border-black text-xs text-black">{index + 1}.</td>
                  <td className="py-2 px-2 border-r border-black">
                    <div>
                      <p className="text-xs font-bold text-black">{item.description}</p>
                      {item.details && (
                        <p className="text-xs text-black mt-1 whitespace-pre-line">{item.details}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right align-top text-xs font-bold text-black">
                    {item.amount.toLocaleString()}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-1/2">
            <div className="mb-4">
              <p className="text-xs font-bold mb-1 text-black">Total in words:</p>
              <p className="text-black text-xs italic">{invoice.totalInWords}</p>
            </div>
            {invoice.notes && (
              <div>
                <p className="text-xs font-bold mb-1 text-black">Notes</p>
                <p className="text-black text-xs leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div className="w-1/3">
            <div className="space-y-1 border border-black p-2">
              <div className="flex justify-between py-1">
                <span className="text-xs text-black">Subtotal</span>
                <span className="text-xs font-bold text-black">{invoice.subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-black">VAT {invoice.vatRate}%</span>
                <span className="text-xs font-bold text-black">{invoice.vatAmount.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between py-1 border-t border-black">
                <span className="text-xs font-bold text-black">Total</span>
                <span className="text-xs font-bold text-black">{invoice.total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-8 pt-4 border-t border-black">
          <div>
            <div className="mb-2">
              <div className="w-24 h-8 border-b border-black mb-1"></div>
              <p className="text-xs text-black">For {invoice.companyName}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-12 h-12 border border-black rounded-full mb-1"></div>
              <p className="text-xs text-black">Company Seal</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 border border-black rounded-full mb-1"></div>
              <p className="text-xs text-black">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="text-center mt-2 text-xs text-black">
          curllabs.com
        </div>
      </div>
    </div>
  );
}