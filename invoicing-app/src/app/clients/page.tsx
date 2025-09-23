'use client';

import Link from 'next/link';
import { Users, Plus, Search, Filter } from 'lucide-react';

export default function Clients() {
    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-2">Manage your client relationships</p>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </button>
                        </div>
                        <Link
                            href="/clients/new"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center transition duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Client
                        </Link>
                    </div>
                </div>

                {/* Clients List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                            <p className="text-gray-500 mb-6">Start building your client database</p>
                            <Link
                                href="/clients/new"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Add Your First Client
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}