'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, FileText, Users, CreditCard, Settings } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-white" />
                            <span className="text-white text-xl font-bold">InvoicePro</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/about"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/invoices"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Invoices
                            </Link>
                            <Link
                                href="/clients"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Clients
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-white hover:bg-blue-800 hover:bg-opacity-50 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                            >
                                Pricing
                            </Link>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link
                            href="/signup"
                            className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 p-2 rounded-md"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
                        <Link
                            href="/"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/about"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            About Us
                        </Link>
                        <Link
                            href="/invoices"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Invoices
                        </Link>
                        <Link
                            href="/clients"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Clients
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/signup"
                            className="text-white hover:bg-blue-800 hover:bg-opacity-50 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;