'use client';

import CreateInvoice from '@/components/CreateInvoice';

export default function NewInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CreateInvoice />
      </div>
    </div>
  );
}