content = """'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { TrendingUp, DollarSign, Users, FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Eye } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [user, router]);

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user.name}! Here is your business overview.</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Dashboard with charts and data coming soon...</p>
                </div>
            </div>
        </div>
    );
}
"""

with open('src/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Dashboard file created successfully!')
