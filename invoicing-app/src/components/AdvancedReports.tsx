'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter, TrendingUp, Calendar } from 'lucide-react';
import Button from './Button';
import Toast from './Toast';

interface RevenueData {
    month: string;
    revenue: number;
    invoices: number;
    paid: number;
}

interface CategoryData {
    name: string;
    value: number;
}

const AdvancedReports: React.FC = () => {
    const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-11-28' });
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const revenueData: RevenueData[] = [
        { month: 'Jan', revenue: 12000, invoices: 8, paid: 11000 },
        { month: 'Feb', revenue: 15000, invoices: 11, paid: 14500 },
        { month: 'Mar', revenue: 18000, invoices: 14, paid: 17800 },
        { month: 'Apr', revenue: 22000, invoices: 16, paid: 21500 },
        { month: 'May', revenue: 25000, invoices: 18, paid: 24800 },
        { month: 'Jun', revenue: 28000, invoices: 21, paid: 27500 },
        { month: 'Jul', revenue: 32000, invoices: 24, paid: 31200 },
        { month: 'Aug', revenue: 35000, invoices: 26, paid: 34000 },
        { month: 'Sep', revenue: 38000, invoices: 28, paid: 37500 },
        { month: 'Oct', revenue: 42000, invoices: 30, paid: 41000 },
        { month: 'Nov', revenue: 45000, invoices: 32, paid: 43500 }
    ];

    const categoryData: CategoryData[] = [
        { name: 'Services', value: 120000 },
        { name: 'Products', value: 85000 },
        { name: 'Consulting', value: 95000 },
        { name: 'Support', value: 45000 }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    const stats = useMemo(() => {
        const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
        const totalInvoices = revenueData.reduce((sum, d) => sum + d.invoices, 0);
        const totalPaid = revenueData.reduce((sum, d) => sum + d.paid, 0);
        const avgInvoice = totalRevenue / totalInvoices;

        return {
            totalRevenue,
            totalInvoices,
            totalPaid,
            avgInvoice: Math.round(avgInvoice),
            outstanding: totalRevenue - totalPaid,
            collectionRate: Math.round((totalPaid / totalRevenue) * 100)
        };
    }, []);

    const handleExportCSV = () => {
        const csv = 'Month,Revenue,Invoices,Paid\n' +
            revenueData.map(d => `${d.month},${d.revenue},${d.invoices},${d.paid}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'revenue-report.csv';
        a.click();
        setToastMessage('Report exported as CSV');
        setShowToast(true);
    };

    const handleExportPDF = () => {
        setToastMessage('PDF export will use jsPDF integration');
        setShowToast(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Advanced Reports & Analytics</h2>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleExportCSV} className="flex items-center text-xs">
                        <Download className="h-4 w-4 mr-1" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={handleExportPDF} className="flex items-center text-xs">
                        <Download className="h-4 w-4 mr-1" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-600 font-medium">Total Invoices</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalInvoices}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Collection Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.collectionRate}%</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">Avg Invoice</p>
                    <p className="text-2xl font-bold text-orange-900">${stats.avgInvoice.toLocaleString()}</p>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-end space-x-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Button variant="primary" className="flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Apply Filter
                </Button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                        Revenue Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                            <Line type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Category */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: $${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Invoices */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Monthly Invoice Volume</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="invoices" fill="#3B82F6" />
                        <Bar dataKey="paid" fill="#10B981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Toast
                message={toastMessage}
                type="info"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default AdvancedReports;
