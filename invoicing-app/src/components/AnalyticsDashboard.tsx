'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import { dataStore, Analytics } from '../lib/dataStore';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const data = dataStore.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // In a real app, this would generate and download the report
    alert(`Exporting ${format.toUpperCase()} report... (Feature would be implemented with a proper backend)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Analytics data is not available yet.</p>
        </div>
      </div>
    );
  }

  const revenueGrowth = analytics.monthlyRevenue.length > 1
    ? ((analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1]?.revenue || 0) -
      (analytics.monthlyRevenue[analytics.monthlyRevenue.length - 2]?.revenue || 0)) /
    (analytics.monthlyRevenue[analytics.monthlyRevenue.length - 2]?.revenue || 1) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Business insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {analytics.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 mr-1 ${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% from last month
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">
                  Rs. {analytics.pendingAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics.pendingInvoices} pending invoices
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {analytics.overdueAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics.overdueInvoices} overdue invoices
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalInvoices}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics.paidInvoices} paid invoices
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.monthlyRevenue.slice(-6).map((item, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(r => r.revenue));
                const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={item.month} className="flex items-center space-x-3">
                    <div className="w-16 text-sm text-gray-600">
                      {new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-sm font-medium text-gray-900 text-right">
                      Rs. {item.revenue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            {analytics.monthlyRevenue.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No revenue data available</p>
              </div>
            )}
          </div>

          {/* Invoice Status Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Status</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <div className="text-sm font-medium">
                  {analytics.paidInvoices} ({Math.round((analytics.paidInvoices / analytics.totalInvoices) * 100)}%)
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="text-sm font-medium">
                  {analytics.pendingInvoices} ({Math.round((analytics.pendingInvoices / analytics.totalInvoices) * 100)}%)
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Overdue</span>
                </div>
                <div className="text-sm font-medium">
                  {analytics.overdueInvoices} ({Math.round((analytics.overdueInvoices / analytics.totalInvoices) * 100)}%)
                </div>
              </div>
            </div>

            {/* Visual pie chart representation */}
            <div className="mt-6 relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="16"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="32"
                    strokeDasharray={`${Math.round((analytics.overdueInvoices / analytics.totalInvoices) * 100)} 100`}
                    strokeDashoffset="25"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="16"
                    fill="transparent"
                    stroke="#eab308"
                    strokeWidth="32"
                    strokeDasharray={`${Math.round((analytics.pendingInvoices / analytics.totalInvoices) * 100)} 100`}
                    strokeDashoffset={`${25 - Math.round((analytics.overdueInvoices / analytics.totalInvoices) * 100)}`}
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="16"
                    fill="transparent"
                    stroke="#22c55e"
                    strokeWidth="32"
                    strokeDasharray={`${Math.round((analytics.paidInvoices / analytics.totalInvoices) * 100)} 100`}
                    strokeDashoffset={`${25 - Math.round((analytics.overdueInvoices / analytics.totalInvoices) * 100) - Math.round((analytics.pendingInvoices / analytics.totalInvoices) * 100)}`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top 5 Clients</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topClients.map((clientData, index) => (
                  <tr key={clientData.client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {clientData.client.name}
                          </div>
                          {clientData.client.company && (
                            <div className="text-sm text-gray-500">
                              {clientData.client.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      Rs. {clientData.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {clientData.invoiceCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {Math.round(clientData.totalRevenue / clientData.invoiceCount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {analytics.topClients.length === 0 && (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No client data available</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Generate Report</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm font-medium">View All Clients</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              <span className="text-sm font-medium">Send Reminders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}