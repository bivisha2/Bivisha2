'use client';

import { useState, useEffect } from 'react';
import { Database, Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface DatabaseStatus {
    success: boolean;
    connected: boolean;
    storage: string;
    userCount: number;
    users: Array<{
        id: string | number;
        name: string;
        email: string;
        role: string;
        created_at: string;
    }>;
    timestamp: string;
    error?: string;
}

export default function DatabaseStatusComponent() {
    const [status, setStatus] = useState<DatabaseStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/database/status');
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            console.error('Failed to fetch database status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Checking database status...</span>
                </div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>Failed to check database status</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Database Status</span>
                </h3>
                <button
                    onClick={fetchStatus}
                    className="p-1 text-gray-500 hover:text-gray-700"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Storage Type */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Storage Type:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.storage === 'PostgreSQL'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {status.storage}
                        </span>
                    </div>
                    {status.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                </div>

                {/* User Count */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-700">Registered Users:</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{status.userCount}</span>
                </div>

                {/* Storage Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                        {status.storage === 'PostgreSQL' ? (
                            <div>
                                <div className="font-medium">✅ Using PostgreSQL Database</div>
                                <div className="mt-1">All user data is permanently stored and will persist across server restarts.</div>
                            </div>
                        ) : (
                            <div>
                                <div className="font-medium">⚠️ Using In-Memory Storage</div>
                                <div className="mt-1">User data is temporary and will be lost when the server restarts. To enable permanent storage, set up PostgreSQL connection.</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                {status.users && status.users.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Recent Users:</h4>
                        <div className="space-y-2">
                            {status.users.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div>
                                        <div className="font-medium text-sm">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                    Last updated: {new Date(status.timestamp).toLocaleString()}
                </div>
            </div>
        </div>
    );
}