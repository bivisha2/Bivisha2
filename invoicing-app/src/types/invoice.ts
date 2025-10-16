// Invoice Type Definitions

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type RecurringFrequency = 'none' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface ClientInfo {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    vatin?: string;
}

export interface InvoiceTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail?: string;
    headerColor: string;
    accentColor: string;
    fontFamily: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    client: ClientInfo;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    discountAmount: number;
    total: number;
    notes: string;
    terms: string;
    template: string;
    recurring: RecurringFrequency;
    nextRecurringDate?: string;
    parentInvoiceId?: string;
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
    paidAt?: string;
    cancelledAt?: string;
}

export interface InvoiceFilters {
    status?: InvoiceStatus;
    dateFrom?: string;
    dateTo?: string;
    clientId?: string;
    search?: string;
}

export interface InvoiceStats {
    totalInvoices: number;
    draftCount: number;
    sentCount: number;
    paidCount: number;
    overdueCount: number;
    cancelledCount: number;
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
}
