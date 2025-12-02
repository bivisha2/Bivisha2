'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Filter, CheckCircle, TrendingUp, DollarSign, Users } from 'lucide-react';

interface ExportOptions {
    format: 'pdf' | 'csv' | 'excel' | 'json';
    dateRange: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    status: 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    includeItems: boolean;
    includeNotes: boolean;
    groupBy: 'none' | 'client' | 'status' | 'month';
}

interface ReportStats {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    averageInvoiceValue: number;
    topClient: string;
    topClientAmount: number;
}

export default function ExportReportingSystem() {
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        format: 'pdf',
        dateRange: 'month',
        status: 'all',
        includeItems: true,
        includeNotes: false,
        groupBy: 'none'
    });

    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [customDateRange, setCustomDateRange] = useState({
        start: '',
        end: ''
    });

    // Mock statistics - would come from database in production
    const stats: ReportStats = {
        totalInvoices: 47,
        totalAmount: 1250000,
        paidAmount: 875000,
        pendingAmount: 275000,
        overdueAmount: 100000,
        averageInvoiceValue: 26596,
        topClient: 'Tech Solutions Ltd',
        topClientAmount: 185000
    };

    const handleExportOptionChange = (key: keyof ExportOptions, value: any) => {
        setExportOptions(prev => ({ ...prev, [key]: value }));
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportSuccess(false);

        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `invoices_${exportOptions.dateRange}_${timestamp}.${exportOptions.format}`;

        // In production, this would generate actual file
        console.log('Exporting with options:', exportOptions);
        console.log('Filename:', filename);

        setIsExporting(false);
        setExportSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => setExportSuccess(false), 3000);
    };

    const generateCSV = () => {
        // Mock CSV generation
        const headers = ['Invoice Number', 'Client', 'Date', 'Amount', 'Status'];
        const data = [
            ['INV-2025-001', 'Tech Solutions Ltd', '2025-11-01', 'Rs. 25000', 'Paid'],
            ['INV-2025-002', 'Digital Marketing Pro', '2025-11-05', 'Rs. 18500', 'Sent'],
            ['INV-2025-003', 'Startup Innovations', '2025-10-15', 'Rs. 42000', 'Overdue']
        ];

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const generateReport = () => {
        // Mock report generation
        const reportData = {
            generated: new Date().toISOString(),
            options: exportOptions,
            statistics: stats
        };

        const jsonContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                                Export & Reporting System
                            </h1>
                            <p className="text-gray-600 mt-2">Generate reports and export invoice data in multiple formats</p>
                        </div>
                        {exportSuccess && (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">Export Successful!</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Export Options */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Export Format Selection */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Download className="h-5 w-5 text-blue-600" />
                                Export Format
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { value: 'pdf', label: 'PDF Document', icon: FileText, color: 'red' },
                                    { value: 'csv', label: 'CSV File', icon: FileSpreadsheet, color: 'green' },
                                    { value: 'excel', label: 'Excel File', icon: FileSpreadsheet, color: 'blue' },
                                    { value: 'json', label: 'JSON Data', icon: FileText, color: 'purple' }
                                ].map((format) => (
                                    <button
                                        key={format.value}
                                        onClick={() => handleExportOptionChange('format', format.value)}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            exportOptions.format === format.value
                                                ? `border-${format.color}-500 bg-${format.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <format.icon className={`h-8 w-8 mx-auto mb-2 ${
                                            exportOptions.format === format.value ? `text-${format.color}-600` : 'text-gray-400'
                                        }`} />
                                        <p className="text-sm font-medium text-gray-900">{format.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range Selection */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Date Range
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: 'all', label: 'All Time' },
                                    { value: 'today', label: 'Today' },
                                    { value: 'week', label: 'This Week' },
                                    { value: 'month', label: 'This Month' },
                                    { value: 'quarter', label: 'This Quarter' },
                                    { value: 'year', label: 'This Year' },
                                    { value: 'custom', label: 'Custom Range' }
                                ].map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => handleExportOptionChange('dateRange', range.value)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${
                                            exportOptions.dateRange === range.value
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>

                            {exportOptions.dateRange === 'custom' && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={customDateRange.start}
                                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={customDateRange.end}
                                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filter Options */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="h-5 w-5 text-blue-600" />
                                Filters & Options
                            </h2>

                            <div className="space-y-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Status</label>
                                    <select
                                        value={exportOptions.status}
                                        onChange={(e) => handleExportOptionChange('status', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="draft">Draft Only</option>
                                        <option value="sent">Sent Only</option>
                                        <option value="paid">Paid Only</option>
                                        <option value="overdue">Overdue Only</option>
                                        <option value="cancelled">Cancelled Only</option>
                                    </select>
                                </div>

                                {/* Group By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
                                    <select
                                        value={exportOptions.groupBy}
                                        onChange={(e) => handleExportOptionChange('groupBy', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="none">No Grouping</option>
                                        <option value="client">By Client</option>
                                        <option value="status">By Status</option>
                                        <option value="month">By Month</option>
                                    </select>
                                </div>

                                {/* Include Options */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exportOptions.includeItems}
                                            onChange={(e) => handleExportOptionChange('includeItems', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Include invoice line items</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exportOptions.includeNotes}
                                            onChange={(e) => handleExportOptionChange('includeNotes', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Include notes and terms</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Export Actions */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5" />
                                            Export {exportOptions.format.toUpperCase()}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={generateCSV}
                                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileSpreadsheet className="h-5 w-5" />
                                    Quick CSV Export
                                </button>

                                <button
                                    onClick={generateReport}
                                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="h-5 w-5" />
                                    JSON Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Statistics Summary */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Summary</h2>

                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">Total Invoices</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">Total Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalAmount.toLocaleString()}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-green-600 mb-1">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-sm">Paid Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">Rs. {stats.paidAmount.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">{Math.round((stats.paidAmount / stats.totalAmount) * 100)}% collection rate</p>
                                </div>

                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm">Pending Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">Rs. {stats.pendingAmount.toLocaleString()}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-red-600 mb-1">
                                        <TrendingUp className="h-4 w-4 rotate-180" />
                                        <span className="text-sm">Overdue Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-700">Rs. {stats.overdueAmount.toLocaleString()}</p>
                                </div>

                                <div className="border-b border-gray-200 pb-3">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">Average Invoice</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">Rs. {stats.averageInvoiceValue.toLocaleString()}</p>
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <Users className="h-4 w-4" />
                                        <span className="text-sm">Top Client</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{stats.topClient}</p>
                                    <p className="text-sm text-gray-600">Rs. {stats.topClientAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Export Preview */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Export Preview</h3>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p>• Format: <span className="font-medium">{exportOptions.format.toUpperCase()}</span></p>
                                <p>• Range: <span className="font-medium">{exportOptions.dateRange}</span></p>
                                <p>• Status: <span className="font-medium">{exportOptions.status}</span></p>
                                <p>• Items: <span className="font-medium">{exportOptions.includeItems ? 'Yes' : 'No'}</span></p>
                                <p>• Notes: <span className="font-medium">{exportOptions.includeNotes ? 'Yes' : 'No'}</span></p>
                                <p>• Group: <span className="font-medium">{exportOptions.groupBy}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
