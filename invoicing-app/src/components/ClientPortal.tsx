'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, Edit2, Save, X } from 'lucide-react';
import Button from './Button';
import Toast from './Toast';

interface ClientProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    taxId?: string;
    registrationDate: string;
    totalInvoices: number;
    totalSpent: number;
    status: 'active' | 'inactive';
}

const ClientPortal: React.FC = () => {
    const [clients, setClients] = useState<ClientProfile[]>([
        {
            id: '1',
            name: 'John Smith',
            email: 'john@acme.com',
            phone: '+1-555-0101',
            company: 'Acme Corp',
            address: '123 Business St',
            city: 'New York',
            country: 'USA',
            zipCode: '10001',
            taxId: 'TAX123456',
            registrationDate: '2025-01-15',
            totalInvoices: 12,
            totalSpent: 45000,
            status: 'active'
        },
        {
            id: '2',
            name: 'Jane Doe',
            email: 'jane@techstartup.com',
            phone: '+1-555-0102',
            company: 'Tech Startup',
            address: '456 Innovation Ave',
            city: 'San Francisco',
            country: 'USA',
            zipCode: '94105',
            registrationDate: '2025-02-10',
            totalInvoices: 8,
            totalSpent: 22500,
            status: 'active'
        }
    ]);

    const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<ClientProfile | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleEdit = (client: ClientProfile) => {
        setEditData({ ...client });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editData) {
            setClients(prev =>
                prev.map(c => c.id === editData.id ? editData : c)
            );
            setSelectedClient(editData);
            setIsEditing(false);
            setToastMessage('Client updated successfully');
            setShowToast(true);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Management Portal</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client List */}
                <div className="lg:col-span-1">
                    <h3 className="font-semibold text-gray-900 mb-4">All Clients ({clients.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {clients.map(client => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    selectedClient?.id === client.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                }`}
                            >
                                <p className="font-medium text-gray-900">{client.name}</p>
                                <p className="text-xs text-gray-600">{client.company}</p>
                                <p className={`text-xs font-semibold mt-1 ${
                                    client.status === 'active' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                    {client.status === 'active' ? '● Active' : '● Inactive'}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Client Details */}
                <div className="lg:col-span-2">
                    {selectedClient ? (
                        <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                            {!isEditing ? (
                                <>
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                                            <p className="text-gray-600 flex items-center mt-1">
                                                <Building2 className="h-4 w-4 mr-2" />
                                                {selectedClient.company}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEdit(selectedClient)}
                                            className="flex items-center text-xs"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-gray-700">
                                            <Mail className="h-5 w-5 mr-3 text-blue-600" />
                                            <span>{selectedClient.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Phone className="h-5 w-5 mr-3 text-blue-600" />
                                            <span>{selectedClient.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                                            <span>{selectedClient.address}, {selectedClient.city}, {selectedClient.country}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Invoices</p>
                                            <p className="text-2xl font-bold text-blue-600">{selectedClient.totalInvoices}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Spent</p>
                                            <p className="text-2xl font-bold text-green-600">${selectedClient.totalSpent.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Member Since</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedClient.registrationDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tax ID</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedClient.taxId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </>
                            ) : editData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Phone"
                                        />
                                        <input
                                            type="text"
                                            value={editData.company}
                                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Company"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={editData.address}
                                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Address"
                                        />
                                        <input
                                            type="text"
                                            value={editData.city}
                                            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="primary" onClick={handleSave} className="flex-1 flex items-center justify-center">
                                            <Save className="h-4 w-4 mr-1" />
                                            Save Changes
                                        </Button>
                                        <Button variant="outline" onClick={handleCancel} className="flex-1 flex items-center justify-center">
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-12 border-2 border-dashed border-gray-300 text-center">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Select a client to view details</p>
                        </div>
                    )}
                </div>
            </div>

            <Toast
                message={toastMessage}
                type="success"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default ClientPortal;
