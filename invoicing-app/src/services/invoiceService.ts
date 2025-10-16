// Invoice Service - Handles all invoice operations

import { Invoice, InvoiceStatus, InvoiceFilters, InvoiceStats, InvoiceTemplate, RecurringFrequency } from '@/types/invoice';

// In-memory storage (replace with actual database in production)
let invoices: Invoice[] = [];
let invoiceCounter = 1;

export const invoiceTemplates: InvoiceTemplate[] = [
    {
        id: 'modern',
        name: 'Modern Blue',
        description: 'Clean and professional blue gradient header',
        headerColor: 'from-blue-600 to-purple-600',
        accentColor: 'blue-600',
        fontFamily: 'Inter, sans-serif'
    },
    {
        id: 'classic',
        name: 'Classic Black',
        description: 'Traditional professional look with black header',
        headerColor: 'from-gray-800 to-gray-900',
        accentColor: 'gray-800',
        fontFamily: 'Georgia, serif'
    },
    {
        id: 'elegant',
        name: 'Elegant Green',
        description: 'Sophisticated green theme for eco-friendly businesses',
        headerColor: 'from-green-600 to-teal-600',
        accentColor: 'green-600',
        fontFamily: 'Lora, serif'
    },
    {
        id: 'vibrant',
        name: 'Vibrant Orange',
        description: 'Eye-catching orange design for creative businesses',
        headerColor: 'from-orange-500 to-red-500',
        accentColor: 'orange-600',
        fontFamily: 'Poppins, sans-serif'
    },
    {
        id: 'minimal',
        name: 'Minimal Gray',
        description: 'Minimalist design with subtle gray tones',
        headerColor: 'from-gray-600 to-gray-700',
        accentColor: 'gray-600',
        fontFamily: 'Helvetica, sans-serif'
    }
];

// Initialize with sample data
export const initializeSampleInvoices = () => {
    const sampleInvoices: Invoice[] = [
        {
            id: '1',
            invoiceNumber: 'INV-001',
            issueDate: '2025-09-20',
            dueDate: '2025-10-20',
            status: 'paid',
            client: {
                id: 'client-1',
                name: 'Ramesh Sharma',
                email: 'ramesh.sharma@example.com',
                phone: '+977-9841234567',
                address: 'Thamel, Kathmandu',
                company: 'Himalayan Tech Solutions'
            },
            items: [
                { id: '1', description: 'Website Development', quantity: 1, rate: 75000, amount: 75000 },
                { id: '2', description: 'SEO Optimization', quantity: 1, rate: 25000, amount: 25000 }
            ],
            subtotal: 100000,
            taxRate: 13,
            taxAmount: 13000,
            discount: 0,
            discountAmount: 0,
            total: 113000,
            notes: 'Thank you for your business!',
            terms: 'Payment is due within 30 days',
            template: 'modern',
            recurring: 'none',
            createdAt: '2025-09-20T10:00:00Z',
            updatedAt: '2025-09-25T14:30:00Z',
            sentAt: '2025-09-20T11:00:00Z',
            paidAt: '2025-09-25T14:30:00Z'
        },
        {
            id: '2',
            invoiceNumber: 'INV-002',
            issueDate: '2025-10-01',
            dueDate: '2025-10-31',
            status: 'sent',
            client: {
                id: 'client-2',
                name: 'Sita Adhikari',
                email: 'sita.adhikari@example.com',
                phone: '+977-9851234567',
                address: 'Durbar Marg, Kathmandu',
                company: 'Nepal Fashion House'
            },
            items: [
                { id: '1', description: 'E-commerce Platform Development', quantity: 1, rate: 150000, amount: 150000 }
            ],
            subtotal: 150000,
            taxRate: 13,
            taxAmount: 19500,
            discount: 5,
            discountAmount: 7500,
            total: 162000,
            notes: 'Includes 1 year free maintenance',
            terms: 'Payment is due within 30 days. Late payments may incur additional charges.',
            template: 'elegant',
            recurring: 'none',
            createdAt: '2025-10-01T09:00:00Z',
            updatedAt: '2025-10-01T09:30:00Z',
            sentAt: '2025-10-01T10:00:00Z'
        },
        {
            id: '3',
            invoiceNumber: 'INV-003',
            issueDate: '2025-09-15',
            dueDate: '2025-09-30',
            status: 'overdue',
            client: {
                id: 'client-3',
                name: 'Krishna Thapa',
                email: 'krishna.thapa@example.com',
                phone: '+977-9861234567',
                address: 'Patan, Lalitpur',
                company: 'Mountain View Consultancy'
            },
            items: [
                { id: '1', description: 'Mobile App Development', quantity: 1, rate: 200000, amount: 200000 }
            ],
            subtotal: 200000,
            taxRate: 13,
            taxAmount: 26000,
            discount: 0,
            discountAmount: 0,
            total: 226000,
            notes: 'Urgent payment required',
            terms: 'Payment is due within 15 days',
            template: 'classic',
            recurring: 'none',
            createdAt: '2025-09-15T08:00:00Z',
            updatedAt: '2025-09-15T08:30:00Z',
            sentAt: '2025-09-15T09:00:00Z'
        },
        {
            id: '4',
            invoiceNumber: 'INV-004',
            issueDate: '2025-10-10',
            dueDate: '2025-11-10',
            status: 'draft',
            client: {
                id: 'client-4',
                name: 'Anita Gurung',
                email: 'anita.gurung@example.com',
                phone: '+977-9871234567',
                address: 'Boudha, Kathmandu',
                company: 'Everest Digital Marketing'
            },
            items: [
                { id: '1', description: 'Social Media Management', quantity: 3, rate: 15000, amount: 45000 },
                { id: '2', description: 'Content Creation', quantity: 2, rate: 20000, amount: 40000 }
            ],
            subtotal: 85000,
            taxRate: 13,
            taxAmount: 11050,
            discount: 10,
            discountAmount: 8500,
            total: 87550,
            notes: '',
            terms: 'Payment is due within 30 days',
            template: 'vibrant',
            recurring: 'monthly',
            nextRecurringDate: '2025-11-10',
            createdAt: '2025-10-10T15:00:00Z',
            updatedAt: '2025-10-10T15:30:00Z'
        },
        {
            id: '5',
            invoiceNumber: 'INV-005',
            issueDate: '2025-10-12',
            dueDate: '2025-10-27',
            status: 'cancelled',
            client: {
                id: 'client-5',
                name: 'Bikash Rai',
                email: 'bikash.rai@example.com',
                phone: '+977-9881234567',
                address: 'Bhaktapur Durbar Square',
                company: 'Heritage Tours Nepal'
            },
            items: [
                { id: '1', description: 'Website Redesign', quantity: 1, rate: 50000, amount: 50000 }
            ],
            subtotal: 50000,
            taxRate: 13,
            taxAmount: 6500,
            discount: 0,
            discountAmount: 0,
            total: 56500,
            notes: 'Project cancelled by client',
            terms: 'Payment is due within 15 days',
            template: 'minimal',
            recurring: 'none',
            createdAt: '2025-10-12T11:00:00Z',
            updatedAt: '2025-10-13T14:00:00Z',
            sentAt: '2025-10-12T12:00:00Z',
            cancelledAt: '2025-10-13T14:00:00Z'
        }
    ];

    invoices = sampleInvoices;
    invoiceCounter = 6;
};

// Generate unique invoice number
export const generateInvoiceNumber = (): string => {
    const number = String(invoiceCounter).padStart(3, '0');
    invoiceCounter++;
    return `INV-${number}`;
};

// Create new invoice
export const createInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice => {
    const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    invoices.push(newInvoice);
    return newInvoice;
};

// Get all invoices
export const getAllInvoices = (): Invoice[] => {
    return [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get invoice by ID
export const getInvoiceById = (id: string): Invoice | undefined => {
    return invoices.find(inv => inv.id === id);
};

// Update invoice
export const updateInvoice = (id: string, updates: Partial<Invoice>): Invoice | undefined => {
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) return undefined;

    invoices[index] = {
        ...invoices[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    return invoices[index];
};

// Delete invoice
export const deleteInvoice = (id: string): boolean => {
    const initialLength = invoices.length;
    invoices = invoices.filter(inv => inv.id !== id);
    return invoices.length < initialLength;
};

// Duplicate invoice
export const duplicateInvoice = (id: string): Invoice | undefined => {
    const original = getInvoiceById(id);
    if (!original) return undefined;

    const duplicate: Invoice = {
        ...original,
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber(),
        status: 'draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sentAt: undefined,
        paidAt: undefined,
        cancelledAt: undefined
    };

    invoices.push(duplicate);
    return duplicate;
};

// Update invoice status
export const updateInvoiceStatus = (id: string, status: InvoiceStatus): Invoice | undefined => {
    const invoice = getInvoiceById(id);
    if (!invoice) return undefined;

    const updates: Partial<Invoice> = {
        status,
        updatedAt: new Date().toISOString()
    };

    if (status === 'sent' && !invoice.sentAt) {
        updates.sentAt = new Date().toISOString();
    } else if (status === 'paid' && !invoice.paidAt) {
        updates.paidAt = new Date().toISOString();
    } else if (status === 'cancelled' && !invoice.cancelledAt) {
        updates.cancelledAt = new Date().toISOString();
    }

    return updateInvoice(id, updates);
};

// Filter invoices
export const filterInvoices = (filters: InvoiceFilters): Invoice[] => {
    let filtered = getAllInvoices();

    if (filters.status) {
        filtered = filtered.filter(inv => inv.status === filters.status);
    }

    if (filters.dateFrom) {
        filtered = filtered.filter(inv => inv.issueDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
        filtered = filtered.filter(inv => inv.issueDate <= filters.dateTo!);
    }

    if (filters.clientId) {
        filtered = filtered.filter(inv => inv.client.id === filters.clientId);
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(inv =>
            inv.invoiceNumber.toLowerCase().includes(searchLower) ||
            inv.client.name.toLowerCase().includes(searchLower) ||
            inv.client.company.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
};

// Get invoice statistics
export const getInvoiceStats = (): InvoiceStats => {
    const stats: InvoiceStats = {
        totalInvoices: invoices.length,
        draftCount: 0,
        sentCount: 0,
        paidCount: 0,
        overdueCount: 0,
        cancelledCount: 0,
        totalRevenue: 0,
        pendingAmount: 0,
        overdueAmount: 0
    };

    invoices.forEach(invoice => {
        switch (invoice.status) {
            case 'draft':
                stats.draftCount++;
                break;
            case 'sent':
                stats.sentCount++;
                stats.pendingAmount += invoice.total;
                break;
            case 'paid':
                stats.paidCount++;
                stats.totalRevenue += invoice.total;
                break;
            case 'overdue':
                stats.overdueCount++;
                stats.overdueAmount += invoice.total;
                stats.pendingAmount += invoice.total;
                break;
            case 'cancelled':
                stats.cancelledCount++;
                break;
        }
    });

    return stats;
};

// Create recurring invoice
export const createRecurringInvoice = (originalId: string): Invoice | undefined => {
    const original = getInvoiceById(originalId);
    if (!original || original.recurring === 'none') return undefined;

    const recurringInvoice: Invoice = {
        ...original,
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber(),
        status: 'draft',
        parentInvoiceId: originalId,
        issueDate: original.nextRecurringDate || new Date().toISOString().split('T')[0],
        dueDate: calculateDueDate(original.nextRecurringDate || new Date().toISOString().split('T')[0], 30),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sentAt: undefined,
        paidAt: undefined,
        cancelledAt: undefined
    };

    // Update next recurring date for original invoice
    const nextDate = calculateNextRecurringDate(recurringInvoice.issueDate, original.recurring);
    updateInvoice(originalId, { nextRecurringDate: nextDate });

    invoices.push(recurringInvoice);
    return recurringInvoice;
};

// Helper: Calculate next recurring date
const calculateNextRecurringDate = (currentDate: string, frequency: RecurringFrequency): string => {
    const date = new Date(currentDate);

    switch (frequency) {
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'quarterly':
            date.setMonth(date.getMonth() + 3);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date.toISOString().split('T')[0];
};

// Helper: Calculate due date
const calculateDueDate = (issueDate: string, daysToAdd: number): string => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
};

// Initialize sample data on module load
if (typeof window !== 'undefined') {
    initializeSampleInvoices();
}
