'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Users, Building, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { dataStore, Client, Invoice } from '../lib/dataStore';

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  vatNumber: string;
  creditLimit: string;
}

const initialFormData: ClientFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  vatNumber: '',
  creditLimit: '',
};

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [errors, setErrors] = useState<Partial<ClientFormData>>({});

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(dataStore.searchClients(searchQuery));
    }
  }, [searchQuery, clients]);

  const loadClients = () => {
    setClients(dataStore.getAllClients());
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Check for duplicate email (excluding current client when editing)
    const existingClient = clients.find(c =>
      c.email === formData.email && c.id !== editingClient?.id
    );
    if (existingClient) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingClient) {
        dataStore.updateClient(editingClient.id, {
          name: formData.name,
          company: formData.company || undefined,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address,
          vatNumber: formData.vatNumber || undefined,
          creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
        });
      } else {
        dataStore.createClient({
          name: formData.name,
          company: formData.company || undefined,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address,
          vatNumber: formData.vatNumber || undefined,
          creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
        });
      }

      loadClients();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingClient(null);
    setErrors({});
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company || '',
      email: client.email,
      phone: client.phone || '',
      address: client.address,
      vatNumber: client.vatNumber || '',
      creditLimit: client.creditLimit?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      dataStore.deleteClient(client.id);
      loadClients();
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
  };

  const getClientStats = (client: Client) => {
    const clientInvoices = dataStore.getInvoicesByClient(client.id);
    const totalInvoices = clientInvoices.length;
    const totalRevenue = clientInvoices
      .filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const outstandingAmount = clientInvoices
      .filter((inv: Invoice) => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return { totalInvoices, totalRevenue, outstandingAmount };
  };

  if (selectedClient) {
    const stats = getClientStats(selectedClient);
    const clientInvoices = dataStore.getInvoicesByClient(selectedClient.id);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedClient(null)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to Clients
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h1>
                {selectedClient.company && (
                  <p className="text-gray-600">{selectedClient.company}</p>
                )}
              </div>
              <button
                onClick={() => handleEdit(selectedClient)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <Edit2 className="h-4 w-4" />
                Edit Client
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedClient.email}</p>
                </div>
              </div>

              {selectedClient.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-sm">{selectedClient.address}</p>
                </div>
              </div>

              {selectedClient.creditLimit && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Credit Limit</p>
                    <p className="font-medium">Rs. {selectedClient.creditLimit.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Total Invoices</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600">Rs. {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900">Outstanding</h3>
                <p className="text-2xl font-bold text-orange-600">Rs. {stats.outstandingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Invoice History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientInvoices.map((invoice: Invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Rs. {invoice.total.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600">Manage your client database</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clients by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Client Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Client full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="client@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Full address including city, state, country"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT/Tax Number
                    </label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VAT123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Limit (Rs.)
                    </label>
                    <input
                      type="number"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingClient ? 'Update Client' : 'Add Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const stats = getClientStats(client);
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          {client.company && (
                            <div className="text-sm text-gray-500">{client.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        {client.phone && (
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Invoices: {stats.totalInvoices}</div>
                        <div>Revenue: Rs. {stats.totalRevenue.toLocaleString()}</div>
                        <div className="text-orange-600">Outstanding: Rs. {stats.outstandingAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(client)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first client'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Client
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}