'use client';

import React, { useState } from 'react';
import { User, Building, CreditCard, Bell, Shield, Globe } from 'lucide-react';
import Button from '@/components/Button';
import Breadcrumb from '@/components/Breadcrumb';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        firstName: 'Ambika',
        lastName: 'Agrawal',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corporation',
        website: 'https://acme.com'
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'company', label: 'Company', icon: Building },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Globe }
    ];

    const handleProfileChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const breadcrumbItems = [
        { label: 'Settings' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} className="mb-4" />

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <ul className="space-y-2">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <li key={tab.id}>
                                            <button
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <IconComponent className="h-5 w-5 mr-3" />
                                                {tab.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.firstName}
                                                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.lastName}
                                                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button variant="primary">Save Changes</Button>
                                    </div>
                                </div>
                            )}

                            {/* Company Tab */}
                            {activeTab === 'company' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => handleProfileChange('company', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={profileData.website}
                                                onChange={(e) => handleProfileChange('website', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company Address
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Enter your company address..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button variant="primary">Save Changes</Button>
                                    </div>
                                </div>
                            )}

                            {/* Other tabs placeholder */}
                            {['billing', 'notifications', 'security', 'preferences'].includes(activeTab) && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {tabs.find(tab => tab.id === activeTab)?.icon && (
                                            React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                                                className: "h-8 w-8 text-gray-400"
                                            })
                                        )}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {tabs.find(tab => tab.id === activeTab)?.label} Settings
                                    </h3>
                                    <p className="text-gray-500">
                                        This section is coming soon. Configure your {activeTab} preferences here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mt-12 mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-lg">SA</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Sarah Anderson</h3>
                                    <p className="text-sm text-gray-600">Small Business Owner</p>
                                </div>
                            </div>
                            <p className="text-gray-700">"This invoicing app has transformed how I manage my business finances. The interface is intuitive and the features are exactly what I need."</p>
                            <div className="flex text-yellow-400 mt-4">
                                {"★".repeat(5)}
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-semibold text-lg">MJ</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Michael Johnson</h3>
                                    <p className="text-sm text-gray-600">Freelance Designer</p>
                                </div>
                            </div>
                            <p className="text-gray-700">"The automated invoice generation saves me hours each month. The professional templates make my business look more established."</p>
                            <div className="flex text-yellow-400 mt-4">
                                {"★".repeat(5)}
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold text-lg">RP</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Rachel Peters</h3>
                                    <p className="text-sm text-gray-600">Marketing Agency</p>
                                </div>
                            </div>
                            <p className="text-gray-700">"The ability to track payments and send automatic reminders has greatly improved our cash flow. Highly recommended!"</p>
                            <div className="flex text-yellow-400 mt-4">
                                {"★".repeat(5)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}