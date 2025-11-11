'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Percent, DollarSign, RefreshCw, Info, Plus, Trash2 } from 'lucide-react';

interface TaxRate {
    id: string;
    name: string;
    rate: number;
    isCompound: boolean;
    isDefault: boolean;
}

interface Currency {
    code: string;
    symbol: string;
    name: string;
    rate: number; // Exchange rate relative to base currency (NPR)
}

interface TaxLineItem {
    id: string;
    taxRateId: string;
    amount: number;
}

interface AdvancedTaxCalculatorProps {
    subtotal: number;
    currency?: string;
    onTotalChange?: (total: number, taxes: TaxLineItem[], convertedAmount?: number) => void;
}

const AdvancedTaxCalculator: React.FC<AdvancedTaxCalculatorProps> = ({
    subtotal,
    currency: initialCurrency = 'NPR',
    onTotalChange,
}) => {
    const [taxRates, setTaxRates] = useState<TaxRate[]>([
        { id: 'vat', name: 'VAT', rate: 13, isCompound: false, isDefault: true },
        { id: 'service', name: 'Service Charge', rate: 10, isCompound: false, isDefault: false },
        { id: 'luxury', name: 'Luxury Tax', rate: 5, isCompound: true, isDefault: false },
    ]);

    const [currencies, setCurrencies] = useState<Currency[]>([
        { code: 'NPR', symbol: 'Rs.', name: 'Nepalese Rupee', rate: 1 },
        { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0075 },
        { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0069 },
        { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0059 },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.625 },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.0115 },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.0105 },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.13 },
    ]);

    const [selectedTaxes, setSelectedTaxes] = useState<string[]>(['vat']);
    const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
    const [customTaxName, setCustomTaxName] = useState('');
    const [customTaxRate, setCustomTaxRate] = useState('');
    const [showAddTax, setShowAddTax] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Get current currency object
    const currentCurrency = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

    // Convert amount from NPR to selected currency
    const convertFromNPR = (amount: number): number => {
        return amount * currentCurrency.rate;
    };

    // Convert amount from selected currency to NPR
    const convertToNPR = (amount: number): number => {
        return amount / currentCurrency.rate;
    };

    // Calculate taxes
    const calculateTaxes = (): { taxes: TaxLineItem[]; total: number } => {
        let runningTotal = subtotal;
        const taxes: TaxLineItem[] = [];

        // Simple taxes first
        selectedTaxes.forEach((taxId) => {
            const tax = taxRates.find((t) => t.id === taxId);
            if (tax && !tax.isCompound) {
                const taxAmount = (subtotal * tax.rate) / 100;
                taxes.push({
                    id: tax.id,
                    taxRateId: tax.id,
                    amount: taxAmount,
                });
                runningTotal += taxAmount;
            }
        });

        // Compound taxes (calculated on subtotal + simple taxes)
        selectedTaxes.forEach((taxId) => {
            const tax = taxRates.find((t) => t.id === taxId);
            if (tax && tax.isCompound) {
                const taxAmount = (runningTotal * tax.rate) / 100;
                taxes.push({
                    id: tax.id,
                    taxRateId: tax.id,
                    amount: taxAmount,
                });
                runningTotal += taxAmount;
            }
        });

        return { taxes, total: runningTotal };
    };

    // Toggle tax selection
    const handleToggleTax = (taxId: string) => {
        setSelectedTaxes((prev) =>
            prev.includes(taxId) ? prev.filter((id) => id !== taxId) : [...prev, taxId]
        );
    };

    // Add custom tax rate
    const handleAddCustomTax = () => {
        if (!customTaxName.trim() || !customTaxRate || Number(customTaxRate) <= 0) {
            alert('Please enter valid tax name and rate');
            return;
        }

        const newTax: TaxRate = {
            id: `custom-${Date.now()}`,
            name: customTaxName,
            rate: Number(customTaxRate),
            isCompound: false,
            isDefault: false,
        };

        setTaxRates((prev) => [...prev, newTax]);
        setCustomTaxName('');
        setCustomTaxRate('');
        setShowAddTax(false);
    };

    // Delete custom tax
    const handleDeleteTax = (taxId: string) => {
        const tax = taxRates.find((t) => t.id === taxId);
        if (tax?.isDefault) return; // Can't delete default taxes

        setTaxRates((prev) => prev.filter((t) => t.id !== taxId));
        setSelectedTaxes((prev) => prev.filter((id) => id !== taxId));
    };

    // Refresh exchange rates (simulated)
    const handleRefreshRates = () => {
        // In real app, this would fetch from API
        setLastUpdated(new Date());
        alert('Exchange rates updated successfully!');
    };

    // Calculate and notify parent
    useEffect(() => {
        const { taxes, total } = calculateTaxes();
        const convertedTotal = convertFromNPR(total);

        if (onTotalChange) {
            onTotalChange(total, taxes, convertedTotal);
        }
    }, [subtotal, selectedTaxes, selectedCurrency]);

    const { taxes, total } = calculateTaxes();
    const convertedSubtotal = convertFromNPR(subtotal);
    const convertedTotal = convertFromNPR(total);
    const totalTaxAmount = taxes.reduce((sum, t) => sum + t.amount, 0);
    const convertedTaxAmount = convertFromNPR(totalTaxAmount);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tax & Currency Calculator</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Advanced tax calculation with multi-currency support
                    </p>
                </div>
                <Calculator className="w-8 h-8 text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Tax Configuration */}
                <div>
                    {/* Available Tax Rates */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">Tax Rates</h3>
                            <button
                                onClick={() => setShowAddTax(true)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Custom
                            </button>
                        </div>

                        {/* Add Custom Tax Form */}
                        {showAddTax && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Add Custom Tax Rate
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={customTaxName}
                                        onChange={(e) => setCustomTaxName(e.target.value)}
                                        placeholder="Tax name (e.g., City Tax)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={customTaxRate}
                                        onChange={(e) => setCustomTaxRate(e.target.value)}
                                        placeholder="Rate (%)"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddCustomTax}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Add Tax
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddTax(false);
                                                setCustomTaxName('');
                                                setCustomTaxRate('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tax Rate List */}
                        <div className="space-y-2">
                            {taxRates.map((tax) => (
                                <div
                                    key={tax.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                        selectedTaxes.includes(tax.id)
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                    onClick={() => handleToggleTax(tax.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedTaxes.includes(tax.id)}
                                            onChange={() => handleToggleTax(tax.id)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">
                                                    {tax.name}
                                                </span>
                                                {tax.isCompound && (
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                        Compound
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {tax.rate}%
                                            </span>
                                        </div>
                                    </div>
                                    {!tax.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTax(tax.id);
                                            }}
                                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tax Info */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex gap-2">
                                <Info className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600">
                                    <strong>Compound taxes</strong> are calculated on the subtotal
                                    plus other taxes. Regular taxes are calculated only on the
                                    subtotal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Currency Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">Currency</h3>
                            <button
                                onClick={handleRefreshRates}
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                                title="Refresh exchange rates"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {currencies.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => setSelectedCurrency(curr.code)}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                        selectedCurrency === curr.code
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-900">{curr.code}</span>
                                        <span className="text-lg">{curr.symbol}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">{curr.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        1 NPR = {curr.rate.toFixed(4)} {curr.code}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* Right Column: Calculation Summary */}
                <div>
                    <div className="sticky top-6">
                        <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Calculation Summary
                            </h3>

                            {/* Amounts in NPR */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-3 font-medium">
                                    Base Currency (NPR)
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Subtotal:</span>
                                        <span className="font-semibold text-gray-900">
                                            Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {taxes.map((tax) => {
                                        const taxRate = taxRates.find((t) => t.id === tax.taxRateId);
                                        return (
                                            <div key={tax.id} className="flex justify-between text-gray-600">
                                                <span>
                                                    {taxRate?.name} ({taxRate?.rate}%):
                                                </span>
                                                <span>
                                                    Rs. {tax.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    <div className="pt-2 border-t border-gray-300 flex justify-between font-semibold text-gray-900">
                                        <span>Total:</span>
                                        <span>
                                            Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Converted Currency */}
                            {selectedCurrency !== 'NPR' && (
                                <div className="pt-4 border-t border-blue-300">
                                    <p className="text-sm text-gray-600 mb-3 font-medium">
                                        Converted to {currentCurrency.name}
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Subtotal:</span>
                                            <span className="font-semibold text-gray-900">
                                                {currentCurrency.symbol} {convertedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-gray-600">
                                            <span>Total Taxes:</span>
                                            <span>
                                                {currentCurrency.symbol} {convertedTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total:</span>
                                            <span>
                                                {currentCurrency.symbol} {convertedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tax Statistics */}
                            <div className="mt-6 pt-4 border-t border-blue-300">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-white rounded-lg">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Percent className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs text-gray-600">
                                                Effective Tax Rate
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {((totalTaxAmount / subtotal) * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-gray-600">Total Tax</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            Rs. {totalTaxAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedTaxCalculator;
