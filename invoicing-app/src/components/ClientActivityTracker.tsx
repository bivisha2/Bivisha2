'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building, TrendingUp, FileText, Banknote } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
}

interface ClientActivity {
    client: Client;
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    lastInvoiceDate: string;
}

interface ClientActivityTrackerProps {
    activities: ClientActivity[];
    limit?: number;
}

export default function ClientActivityTracker({ activities, limit = 5 }: ClientActivityTrackerProps) {
    const [sortedActivities, setSortedActivities] = useState<ClientActivity[]>([]);
    const [sortBy, setSortBy] = useState<'amount' | 'invoices' | 'recent'>('amount');

    useEffect(() => {
        let sorted = [...activities];
        
        if (sortBy === 'amount') {
            sorted.sort((a, b) => b.totalAmount - a.totalAmount);
        } else if (sortBy === 'invoices') {
            sorted.sort((a, b) => b.totalInvoices - a.totalInvoices);
        } else if (sortBy === 'recent') {
            sorted.sort((a, b) => new Date(b.lastInvoiceDate).getTime() - new Date(a.lastInvoiceDate).getTime());
        }

        setSortedActivities(sorted.slice(0, limit));
    }, [activities, sortBy, limit]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Top Client Activity</h3>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'amount' | 'invoices' | 'recent')}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="amount">By Amount</option>
                        <option value="invoices">By Invoices</option>
                        <option value="recent">Most Recent</option>
                    </select>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {sortedActivities.length > 0 ? (
                    sortedActivities.map((activity, index) => (
                        <div key={activity.client.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start flex-1 min-w-0">
                                    <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {activity.client.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {activity.client.name}
                                            </p>
                                            {index === 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                    Top
                                                </span>
                                            )}
                                        </div>
                                        {activity.client.company && (
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                <Building className="h-3 w-3 mr-1" />
                                                {activity.client.company}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center text-xs text-gray-600">
                                                <FileText className="h-3 w-3 mr-1" />
                                                {activity.totalInvoices} invoice{activity.totalInvoices > 1 ? 's' : ''}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600">
                                                <Banknote className="h-3 w-3 mr-1" />
                                                Rs. {activity.totalAmount.toLocaleString('en-US')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-4 text-right shrink-0">
                                    <div className="text-xs text-gray-500 mb-1">
                                        Last invoice
                                    </div>
                                    <div className="text-xs font-medium text-gray-900">
                                        {formatDate(activity.lastInvoiceDate)}
                                    </div>
                                    <div className="mt-2">
                                        {activity.pendingAmount > 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Rs. {activity.pendingAmount.toLocaleString('en-US')} pending
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Paid up
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No client activity yet</p>
                        <p className="text-xs mt-1">Create invoices to see client activity</p>
                    </div>
                )}
            </div>

            {activities.length > limit && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-center text-gray-600">
                        Showing top {limit} of {activities.length} clients
                    </p>
                </div>
            )}
        </div>
    );
}
